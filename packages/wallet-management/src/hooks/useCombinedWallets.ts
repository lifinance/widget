import { ChainType } from '@lifi/sdk'
import {
  useEVMContext,
  useMVMContext,
  useSVMContext,
  useUTXOContext,
  type WalletConnector,
} from '@lifi/wallet-provider'
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
  evmConnectorList: WalletConnector[],
  utxoConnectorList: WalletConnector[],
  svmWalletList: WalletConnector[],
  mvmWalletList: WalletConnector[],
  walletEcosystemsOrder?: Record<string, ChainType[]>
): CombinedWallet[] => {
  const walletMap = new Map<string, CombinedWallet>()

  evmConnectorList.forEach((evm) => {
    const evmName = evm?.displayName || evm?.name
    const normalizedName = normalizeName(evmName)
    const existing = walletMap.get(normalizedName) || {
      id: evm.id,
      name: evmName,
      icon: getConnectorIcon(evm),
      connectors: [] as CombinedWalletConnector[],
    }
    existing.connectors.push({ connector: evm, chainType: ChainType.EVM })
    walletMap.set(normalizedName, existing)
  })

  utxoConnectorList.forEach((utxo) => {
    const utxoName = utxo.name
    const normalizedName = normalizeName(utxoName)
    const existing = walletMap.get(normalizedName) || {
      id: utxo.id,
      name: utxoName,
      icon: getConnectorIcon(utxo),
      connectors: [] as CombinedWalletConnector[],
    }
    existing.connectors.push({ connector: utxo, chainType: ChainType.UTXO })
    walletMap.set(normalizedName, existing)
  })

  svmWalletList.forEach((svm) => {
    const normalizedName = normalizeName(svm.name)
    const existing = walletMap.get(normalizedName) || {
      id: svm.name,
      name: svm.name,
      icon: svm.icon,
      connectors: [] as CombinedWalletConnector[],
    }
    existing.connectors.push({
      connector: svm,
      chainType: ChainType.SVM,
    })
    walletMap.set(normalizedName, existing)
  })

  mvmWalletList.forEach((sui) => {
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
  const { installedWallets: installedEVMWallets } = useEVMContext()
  const { installedWallets: installedUTXOWallets } = useUTXOContext()
  const { installedWallets: installedSVMWallets } = useSVMContext()
  const { installedWallets: installedMVMWallets } = useMVMContext()

  const combinedWallets = useMemo(() => {
    const includeEcosystem = (chainType: ChainType) =>
      !walletConfig.enabledChainTypes ||
      walletConfig.enabledChainTypes.includes(chainType)

    const installedCombinedWallets = combineWalletLists(
      includeEcosystem(ChainType.EVM) ? installedEVMWallets : [],
      includeEcosystem(ChainType.UTXO) ? installedUTXOWallets : [],
      includeEcosystem(ChainType.SVM) ? installedSVMWallets : [],
      includeEcosystem(ChainType.MVM) ? installedMVMWallets : [],
      walletConfig.walletEcosystemsOrder
    )

    installedCombinedWallets.sort(walletComparator)

    return installedCombinedWallets
  }, [
    installedEVMWallets,
    installedUTXOWallets,
    installedSVMWallets,
    installedMVMWallets,
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
