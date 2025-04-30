import {
  useAccount as useBigmiAccount,
  useConfig as useBigmiConfig,
  useConnect as useBigmiConnect,
} from '@bigmi/react'

import type { Connector as BigmiConnector } from '@bigmi/client'

import { ChainType } from '@lifi/sdk'
import type { Theme } from '@mui/material'
import { useMediaQuery } from '@mui/material'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import type { Wallet } from '@solana/wallet-adapter-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'
import type { Connector } from 'wagmi'
import { useAccount, useConnect } from 'wagmi'
import { defaultCoinbaseConfig } from '../config/coinbase.js'
import { defaultMetaMaskConfig } from '../config/metaMask.js'
import { defaultWalletConnectConfig } from '../config/walletConnect.js'
import { createCoinbaseConnector } from '../connectors/coinbase.js'
import { createMetaMaskConnector } from '../connectors/metaMask.js'
import type {
  CreateBigmiConnectorFnExtended,
  CreateConnectorFnExtended,
} from '../connectors/types.js'
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
  utxoConnectorList: (CreateBigmiConnectorFnExtended | BigmiConnector)[],
  evmConnectorList: (CreateConnectorFnExtended | Connector)[],
  svmWalletList: Wallet[]
): CombinedWallet[] => {
  const walletMap = new Map<string, CombinedWallet>()

  utxoConnectorList.forEach((utxo) => {
    const utxoName =
      (utxo as CreateBigmiConnectorFnExtended)?.displayName ||
      (utxo as BigmiConnector)?.name
    const normalizedName = normalizeName(utxoName)
    const existing = walletMap.get(normalizedName) || {
      id: utxo.id,
      name: utxoName,
      icon: getConnectorIcon(utxo as BigmiConnector),
      connectors: [],
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
      connectors: [],
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
      connectors: [],
    }
    existing.connectors.push({
      connector: svm.adapter,
      chainType: ChainType.SVM,
    })
    walletMap.set(normalizedName, existing)
  })

  const combinedWallets = Array.from(walletMap.values())
  combinedWallets.sort(walletComparator)

  return combinedWallets
}

export const useCombinedWallets = () => {
  const walletConfig = useWalletManagementConfig()
  const bigmiConfig = useBigmiConfig()
  const wagmiAccount = useAccount()
  const bigmiAccount = useBigmiAccount({ config: bigmiConfig })
  const { connectors: wagmiConnectors } = useConnect()
  const { connectors: bigmiConnectors } = useBigmiConnect({
    config: bigmiConfig,
  })
  const { wallets: solanaWallets } = useWallet()

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
          const isConnected = bigmiAccount.connector?.id === connector.id
          return isInstalled && !isConnected
        })
      : []

    const installedEVMConnectors = includeEcosystem(ChainType.EVM)
      ? evmConnectors.filter((connector) => {
          const isInstalled = isWalletInstalled(connector.id)
          const isConnected = wagmiAccount.connector?.id === connector.id
          return isInstalled && !isConnected
        })
      : []

    const installedSVMWallets = includeEcosystem(ChainType.SVM)
      ? solanaWallets.filter((wallet) => {
          const isInstalled =
            wallet.adapter.readyState === WalletReadyState.Installed ||
            wallet.adapter.readyState === WalletReadyState.Loadable
          const isConnected = wallet.adapter.connected
          return isInstalled && !isConnected
        })
      : []

    const installedCombinedWallets = combineWalletLists(
      installedUTXOConnectors,
      installedEVMConnectors,
      installedSVMWallets
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
      notDetectedSVMWallets
    )

    installedCombinedWallets.sort(walletComparator)
    notDetectedCombinedWallets.sort(walletComparator)

    return {
      installedWallets: installedCombinedWallets,
      notDetectedWallets: notDetectedCombinedWallets,
    }
  }, [
    bigmiAccount.connector?.id,
    bigmiConnectors,
    solanaWallets,
    wagmiAccount.connector?.id,
    wagmiConnectors,
    isDesktopView,
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
