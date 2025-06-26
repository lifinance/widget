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
import { useMemo } from 'react'
import type { Connector } from 'wagmi'
import { useConnect } from 'wagmi'
import { defaultCoinbaseConfig } from '../config/coinbase.js'
import { defaultMetaMaskConfig } from '../config/metaMask.js'
import { defaultWalletConnectConfig } from '../config/walletConnect.js'
import { createCoinbaseConnector } from '../connectors/coinbase.js'
import { createMetaMaskConnector } from '../connectors/metaMask.js'
import type { CreateConnectorFnExtended } from '../connectors/types.js'
import { createWalletConnectConnector } from '../connectors/walletConnect.js'
import { useWalletManagementConfig } from '../providers/WalletManagementProvider/WalletManagementContext.js'
import type { WalletConnector } from '../types/walletConnector.js'
import { getConnectorIcon } from '../utils/getConnectorIcon.js'
import { getWalletPriority } from '../utils/getWalletPriority.js'
import { isWalletInstalled } from '../utils/isWalletInstalled.js'

export type CombinedWalletConnector = {
  connector: WalletConnector
  chainType: ChainType
}

export type CombinedWallet = {
  id: string
  name: string
  icon?: string
  connectors: CombinedWalletConnector[]
}

const normalizeName = (name: string) => name.split(' ')[0].toLowerCase().trim()

const combineWalletLists = (
  utxoConnectorList: BigmiConnector[],
  evmConnectorList: (CreateConnectorFnExtended | Connector)[],
  svmWalletList: Wallet[],
  suiWalletList: WalletWithRequiredFeatures[]
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

  const combinedWallets = Array.from(walletMap.values())
  combinedWallets.sort(walletComparator)

  return combinedWallets
}

export const useCombinedWallets = () => {
  const walletConfig = useWalletManagementConfig()
  const { connectors: wagmiConnectors } = useConnect()
  const { connectors: bigmiConnectors } = useBigmiConnect()
  const { wallets: solanaWallets } = useWallet()
  const suiWallets = useWallets()

  const isDesktopView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  )

  const data = useMemo(() => {
    const evmConnectors: (CreateConnectorFnExtended | Connector)[] =
      Array.from(wagmiConnectors)

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
        createCoinbaseConnector(walletConfig?.coinbase ?? defaultCoinbaseConfig)
      )
    }
    if (
      !evmConnectors.some((connector) =>
        connector.id.toLowerCase().includes('metamask')
      )
    ) {
      evmConnectors.unshift(
        createMetaMaskConnector(walletConfig?.metaMask ?? defaultMetaMaskConfig)
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
      installedSuiWallets
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

    return {
      installedWallets: installedCombinedWallets,
      notDetectedWallets: notDetectedCombinedWallets,
    }
  }, [
    bigmiConnectors,
    isDesktopView,
    solanaWallets,
    suiWallets,
    wagmiConnectors,
    walletConfig,
  ])

  return data
}

// Ensure the walletComparator function is updated to handle CombinedWallet
export const walletComparator = (a: CombinedWallet, b: CombinedWallet) => {
  const priorityA = getWalletPriority(a.id)
  const priorityB = getWalletPriority(b.id)

  if (priorityA !== priorityB) {
    return priorityA - priorityB
  }

  return a.id?.localeCompare(b.id)
}
