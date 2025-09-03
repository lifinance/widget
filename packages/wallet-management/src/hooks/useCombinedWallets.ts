import type { Connector as BigmiConnector } from '@bigmi/client'
import { useConnect as useBigmiConnect } from '@bigmi/react'
import { ChainType } from '@lifi/sdk'
import type { Theme } from '@mui/material'
import { useMediaQuery } from '@mui/material'
import { useWallets } from '@mysten/dapp-kit'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import type { Wallet } from '@solana/wallet-adapter-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import type { Connector } from 'wagmi'
import { useConnect } from 'wagmi'
import { defaultBaseAccountConfig } from '../config/baseAccount.js'
import { defaultCoinbaseConfig } from '../config/coinbase.js'
import { defaultMetaMaskConfig } from '../config/metaMask.js'
import { defaultWalletConnectConfig } from '../config/walletConnect.js'
import { createBaseAccountConnector } from '../connectors/baseAccount.js'
import { createCoinbaseConnector } from '../connectors/coinbase.js'
import { createMetaMaskConnector } from '../connectors/metaMask.js'
import type { CreateConnectorFnExtended } from '../connectors/types.js'
import { createWalletConnectConnector } from '../connectors/walletConnect.js'
import { useWalletManagementConfig } from '../providers/WalletManagementProvider/WalletManagementContext.js'
import type { WalletConnector } from '../types/walletConnector.js'
import { getConnectorIcon } from '../utils/getConnectorIcon.js'
import { getWalletPriority } from '../utils/getWalletPriority.js'
import { isWalletInstalled } from '../utils/isWalletInstalled.js'

type CombinedWalletConnector = {
  connector: WalletConnector
  chainType: ChainType
}

export type CombinedWallet = {
  id: string
  name: string
  icon?: string
  connectors: CombinedWalletConnector[]
}

type CombinedWallets = {
  installedWallets: CombinedWallet[]
  notDetectedWallets: CombinedWallet[]
}

const normalizeName = (name: string) => name.split(' ')[0].toLowerCase().trim()

const combineWalletLists = (
  utxoConnectorList: BigmiConnector[],
  evmConnectorList: (CreateConnectorFnExtended | Connector)[],
  svmWalletList: Wallet[],
  suiWalletList: WalletWithRequiredFeatures[],
  walletEcosystemsOrder?: Record<string, ChainType[]>
): CombinedWallet[] => {
  const walletMap = new Map<string, CombinedWallet>()

  utxoConnectorList.forEach((utxo) => {
    const utxoName = utxo.name
    const normalizedName = normalizeName(utxoName)
    const existing = walletMap.get(normalizedName) || {
      id: utxo.id,
      name: utxoName,
      icon: getConnectorIcon(utxo as BigmiConnector),
      connectors: [] as CombinedWalletConnector[],
    }
    existing.connectors.push({ connector: utxo, chainType: ChainType.UTXO })
    walletMap.set(normalizedName, existing)
  })

  evmConnectorList.forEach((evm) => {
    const evmName =
      (evm as CreateConnectorFnExtended)?.displayName ||
      (evm as Connector)?.name
    const normalizedName = normalizeName(evmName)
    const existing = walletMap.get(normalizedName) || {
      id: evm.id,
      name: evmName,
      icon: getConnectorIcon(evm as Connector),
      connectors: [] as CombinedWalletConnector[],
    }
    existing.connectors.push({ connector: evm, chainType: ChainType.EVM })
    walletMap.set(normalizedName, existing)
  })

  svmWalletList.forEach((svm) => {
    const normalizedName = normalizeName(svm.adapter.name)
    const existing = walletMap.get(normalizedName) || {
      id: svm.adapter.name,
      name: svm.adapter.name,
      icon: svm.adapter.icon,
      connectors: [] as CombinedWalletConnector[],
    }
    existing.connectors.push({
      connector: svm.adapter,
      chainType: ChainType.SVM,
    })
    walletMap.set(normalizedName, existing)
  })

  suiWalletList.forEach((sui) => {
    const normalizedName = normalizeName(sui.name)
    const existing = walletMap.get(normalizedName) || {
      id: sui.name,
      name: sui.name,
      icon: sui.icon,
      connectors: [] as CombinedWalletConnector[],
    }
    existing.connectors.push({ connector: sui, chainType: ChainType.MVM })
    walletMap.set(normalizedName, existing)
  })

  let combinedWallets = Array.from(walletMap.values())
  if (walletEcosystemsOrder) {
    combinedWallets = combinedWallets.map((wallet) => {
      const order = walletEcosystemsOrder[wallet.name]
      if (order) {
        return {
          ...wallet,
          connectors: wallet.connectors.sort((a, b) =>
            walletEcosystemsComparator(a, b, order)
          ),
        }
      }
      return wallet
    })
  }
  combinedWallets.sort(walletComparator)

  return combinedWallets
}

export const useCombinedWallets = () => {
  const walletConfig = useWalletManagementConfig()
  const { connectors: wagmiConnectors } = useConnect()
  const { connectors: bigmiConnectors } = useBigmiConnect()
  const { wallets: solanaWallets } = useWallet()
  const suiWallets = useWallets()
  const [combinedWallets, setCombinedWallets] = useState<CombinedWallets>(
    () => {
      return {
        installedWallets: [],
        notDetectedWallets: [],
      }
    }
  )

  const isDesktopView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  )

  useEffect(() => {
    ;(async () => {
      let evmConnectors: (CreateConnectorFnExtended | Connector)[] = Array.from(
        wagmiConnectors
        // Remove duplicate connectors
      ).filter(
        (connector, index, self) =>
          index === self.findIndex((c) => c.id === connector.id)
      )

      // Check if Safe connector exists and can get a provider
      const safeConnector = evmConnectors.find(
        (connector) => connector.id === 'safe'
      ) as Connector | undefined
      let shouldFilterOutSafeConnector = false

      if (safeConnector) {
        try {
          const provider = await safeConnector.getProvider()
          // If no provider is available, we should filter out the Safe connector
          if (!provider) {
            shouldFilterOutSafeConnector = true
          }
        } catch {
          // If getting provider fails, filter out the Safe connector
          shouldFilterOutSafeConnector = true
        }
      }

      if (shouldFilterOutSafeConnector) {
        evmConnectors = evmConnectors.filter(
          (connector) => connector.id !== 'safe'
        )
      }

      // Ensure standard connectors are included
      if (
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('walletconnect')
        )
      ) {
        evmConnectors.unshift(
          createWalletConnectConnector(
            walletConfig?.walletConnect ?? defaultWalletConnectConfig
          )
        )
      }
      if (
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('coinbase')
        )
      ) {
        evmConnectors.unshift(
          createCoinbaseConnector(
            walletConfig?.coinbase ?? defaultCoinbaseConfig
          )
        )
      }
      if (
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('metamask')
        )
      ) {
        evmConnectors.unshift(
          createMetaMaskConnector(
            walletConfig?.metaMask ?? defaultMetaMaskConfig
          )
        )
      }
      if (
        !evmConnectors.some((connector) =>
          connector.id.toLowerCase().includes('baseaccount')
        )
      ) {
        evmConnectors.unshift(
          createBaseAccountConnector(
            walletConfig?.baseAccount ?? defaultBaseAccountConfig
          )
        )
      }

      const includeEcosystem = (chainType: ChainType) =>
        !walletConfig.enabledChainTypes ||
        walletConfig.enabledChainTypes.includes(chainType)

      const installedUTXOConnectors = includeEcosystem(ChainType.UTXO)
        ? bigmiConnectors.filter((connector) => {
            const isInstalled = isWalletInstalled(connector.id)
            return isInstalled
          })
        : []

      const installedEVMConnectors = includeEcosystem(ChainType.EVM)
        ? evmConnectors.filter((connector) => {
            const isInstalled = isWalletInstalled(connector.id)
            return isInstalled
          })
        : []

      const installedSVMWallets = includeEcosystem(ChainType.SVM)
        ? solanaWallets.filter((wallet) => {
            const isInstalled =
              wallet.adapter.readyState === WalletReadyState.Installed ||
              wallet.adapter.readyState === WalletReadyState.Loadable
            return isInstalled
          })
        : []

      const installedSuiWallets = includeEcosystem(ChainType.MVM)
        ? suiWallets
        : []

      const installedCombinedWallets = combineWalletLists(
        installedUTXOConnectors,
        installedEVMConnectors,
        installedSVMWallets,
        installedSuiWallets,
        walletConfig.walletEcosystemsOrder
      )

      const notDetectedUTXOConnectors = bigmiConnectors.filter((connector) => {
        const isInstalled = isWalletInstalled(connector.id)
        return !isInstalled && isDesktopView
      })

      const notDetectedEVMConnectors = evmConnectors.filter((connector) => {
        const isInstalled = isWalletInstalled(connector.id)
        return !isInstalled && isDesktopView
      })

      const notDetectedSVMWallets = solanaWallets.filter((wallet) => {
        const isInstalled =
          wallet.adapter.readyState === WalletReadyState.Installed ||
          wallet.adapter.readyState === WalletReadyState.Loadable
        return !isInstalled && isDesktopView
      })

      const notDetectedCombinedWallets = combineWalletLists(
        notDetectedUTXOConnectors,
        notDetectedEVMConnectors,
        notDetectedSVMWallets,
        []
      )

      installedCombinedWallets.sort(walletComparator)
      notDetectedCombinedWallets.sort(walletComparator)

      setCombinedWallets({
        installedWallets: installedCombinedWallets,
        notDetectedWallets: notDetectedCombinedWallets,
      })
    })()
  }, [
    bigmiConnectors,
    isDesktopView,
    solanaWallets,
    suiWallets,
    wagmiConnectors,
    walletConfig,
  ])

  return combinedWallets
}

// Ensure the walletComparator function is updated to handle CombinedWallet
const walletComparator = (a: CombinedWallet, b: CombinedWallet) => {
  const priorityA = getWalletPriority(a.id)
  const priorityB = getWalletPriority(b.id)

  if (priorityA !== priorityB) {
    return priorityA - priorityB
  }

  return a.id?.localeCompare(b.id)
}

const walletEcosystemsComparator = (
  a: CombinedWalletConnector,
  b: CombinedWalletConnector,
  order: ChainType[]
) => {
  if (!order.length) {
    return 0
  }

  const ecosystemA = a.chainType
  const ecosystemB = b.chainType

  if (ecosystemA === ecosystemB) {
    return 0
  }

  const indexA = order.indexOf(ecosystemA)
  const indexB = order.indexOf(ecosystemB)

  // If both are in the order list, sort by their position
  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB
  }

  // If only one is in the order list, prioritize it
  if (indexA !== -1) {
    return -1
  }
  if (indexB !== -1) {
    return 1
  }

  return 0
}
