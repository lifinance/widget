import type { Chain } from '@lifi/sdk'
import { ChainId, ChainType, isHex } from '@lifi/sdk'
import { internalExplorerUrl } from '../config/constants.js'
import { useAvailableChains } from '../hooks/useAvailableChains.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'

const sanitiseBaseUrl = (baseUrl: string) => baseUrl.trim().replace(/\/+$/, '')

const explorerPathOverrides: Partial<
  Record<ChainType | ChainId, { txPath: string; addressPath: string }>
> = {
  [ChainId.SUI]: { txPath: 'txblock', addressPath: 'coin' },
  [ChainType.TVM]: { txPath: '#/transaction', addressPath: '#/address' },
}

type TransactionLinkProps = { chain?: Chain | number } & (
  | {
      txHash: string
      txLink?: never
    }
  | {
      txHash?: never
      txLink: string
    }
)

export const useExplorer = (): {
  getTransactionLink: (props: TransactionLinkProps) => string | undefined
  getAddressLink: (address: string, chain?: Chain | number) => string
} => {
  const { explorerUrls } = useWidgetConfig()
  const { getChainById } = useAvailableChains()

  const getExplorerConfig = (chain?: Chain | number) => {
    const resolvedChain = Number.isFinite(chain)
      ? getChainById(chain as number)
      : (chain as Chain)

    const explorerUrl =
      (resolvedChain
        ? (explorerUrls?.[resolvedChain.id]?.[0] ??
          resolvedChain.metamask.blockExplorerUrls[0])
        : explorerUrls?.internal?.[0]) || internalExplorerUrl

    const baseUrl =
      typeof explorerUrl === 'string' ? explorerUrl : explorerUrl.url

    const overrides =
      explorerPathOverrides[resolvedChain?.id as ChainId] ??
      explorerPathOverrides[resolvedChain?.chainType as ChainType]

    const defaultTxPath = overrides?.txPath ?? 'tx'
    const defaultAddressPath = overrides?.addressPath ?? 'address'
    const txPath =
      typeof explorerUrl === 'string'
        ? defaultTxPath
        : explorerUrl.txPath || defaultTxPath
    const addressPath =
      typeof explorerUrl === 'string'
        ? defaultAddressPath
        : explorerUrl.addressPath || defaultAddressPath

    return {
      url: sanitiseBaseUrl(baseUrl),
      txPath,
      addressPath,
      resolvedChain,
    }
  }

  const getTransactionLink = ({
    txHash,
    txLink,
    chain,
  }: TransactionLinkProps): string | undefined => {
    if (!txHash) {
      return txLink
    }

    const config = getExplorerConfig(chain)

    // For EVM chains, validate the transaction hash as some relayers return custom task hashes that are not visible on-chain
    if (config.resolvedChain?.chainType === ChainType.EVM) {
      if (!isHex(txHash, { strict: true })) {
        return undefined
      }
    }

    return `${config.url}/${config.txPath}/${txHash}`
  }

  const getAddressLink = (address: string, chain?: Chain | number) => {
    const config = getExplorerConfig(chain)
    return `${config.url}/${config.addressPath}/${address}`
  }

  return {
    getTransactionLink,
    getAddressLink,
  }
}
