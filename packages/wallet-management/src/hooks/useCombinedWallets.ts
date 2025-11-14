import { ChainType } from '@lifi/sdk'
import {
  useBitcoinContext,
  useEthereumContext,
  useSolanaContext,
  useSuiContext,
  type WalletConnector,
} from '@lifi/widget-provider'
import { useMemo } from 'react'
import { useWalletManagementConfig } from '../providers/WalletManagementProvider/WalletManagementContext.js'
import { getConnectorIcon } from '../utils/getConnectorIcon.js'
import { getWalletPriority } from '../utils/getWalletPriority.js'

type CombinedWalletConnector = {
  connector: WalletConnector
  chainType: ChainType
}

export type CombinedWallet = {
  id?: string
  name: string
  icon?: string
  connectors: CombinedWalletConnector[]
}

const normalizeName = (name: string) => name.split(' ')[0].toLowerCase().trim()

const combineWalletLists = (
  ethereumConnectorList: WalletConnector[],
  bitcoinConnectorList: WalletConnector[],
  solanaWalletList: WalletConnector[],
  suiWalletList: WalletConnector[],
  walletEcosystemsOrder?: Record<string, ChainType[]>
): CombinedWallet[] => {
  const walletMap = new Map<string, CombinedWallet>()

  ethereumConnectorList.forEach((ethereum) => {
    const ethereumName = ethereum?.displayName || ethereum?.name
    const normalizedName = normalizeName(ethereumName)
    const existing = walletMap.get(normalizedName) || {
      id: ethereum.id,
      name: ethereumName,
      icon: getConnectorIcon(ethereum),
      connectors: [] as CombinedWalletConnector[],
    }
    existing.connectors.push({ connector: ethereum, chainType: ChainType.EVM })
    walletMap.set(normalizedName, existing)
  })

  bitcoinConnectorList.forEach((bitcoin) => {
    const bitcoinName = bitcoin.name
    const normalizedName = normalizeName(bitcoinName)
    const existing = walletMap.get(normalizedName) || {
      id: bitcoin.id,
      name: bitcoinName,
      icon: getConnectorIcon(bitcoin),
      connectors: [] as CombinedWalletConnector[],
    }
    existing.connectors.push({ connector: bitcoin, chainType: ChainType.UTXO })
    walletMap.set(normalizedName, existing)
  })

  solanaWalletList.forEach((solana) => {
    const normalizedName = normalizeName(solana.name)
    const existing = walletMap.get(normalizedName) || {
      id: solana.name,
      name: solana.name,
      icon: solana.icon,
      connectors: [] as CombinedWalletConnector[],
    }
    existing.connectors.push({
      connector: solana,
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
  const { installedWallets: installedEthereumWallets } = useEthereumContext()
  const { installedWallets: installedBitcoinWallets } = useBitcoinContext()
  const { installedWallets: installedSolanaWallets } = useSolanaContext()
  const { installedWallets: installedSuiWallets } = useSuiContext()

  const combinedWallets = useMemo(() => {
    const includeEcosystem = (chainType: ChainType) =>
      !walletConfig.enabledChainTypes ||
      walletConfig.enabledChainTypes.includes(chainType)

    const installedCombinedWallets = combineWalletLists(
      includeEcosystem(ChainType.EVM) ? installedEthereumWallets : [],
      includeEcosystem(ChainType.UTXO) ? installedBitcoinWallets : [],
      includeEcosystem(ChainType.SVM) ? installedSolanaWallets : [],
      includeEcosystem(ChainType.MVM) ? installedSuiWallets : [],
      walletConfig.walletEcosystemsOrder
    )

    installedCombinedWallets.sort(walletComparator)

    return installedCombinedWallets
  }, [
    installedEthereumWallets,
    installedBitcoinWallets,
    installedSolanaWallets,
    installedSuiWallets,
    walletConfig,
  ])

  return combinedWallets
}

// Ensure the walletComparator function is updated to handle CombinedWallet
const walletComparator = (a: CombinedWallet, b: CombinedWallet) => {
  const idA = a.id ?? a.name
  const idB = b.id ?? b.name

  const priorityA = getWalletPriority(idA)
  const priorityB = getWalletPriority(idB)

  if (priorityA !== priorityB) {
    return priorityA - priorityB
  }

  return idA.localeCompare(idB)
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
