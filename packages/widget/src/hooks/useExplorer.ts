import type { Chain } from '@lifi/sdk'
import { ChainId } from '@lifi/sdk'
import { lifiExplorerUrl } from '../config/constants.js'
import { useAvailableChains } from '../hooks/useAvailableChains.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'

const sanitiseBaseUrl = (baseUrl: string) => baseUrl.trim().replace(/\/+$/, '')

export type TransactionLinkProps = { chain?: Chain | number } & (
  | {
      txHash: string
      txLink?: never
    }
  | {
      txHash?: never
      txLink: string
    }
)

export const useExplorer = () => {
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
        : explorerUrls?.internal?.[0]) || lifiExplorerUrl

    const url = typeof explorerUrl === 'string' ? explorerUrl : explorerUrl.url

    const defaultTxPath = resolvedChain?.id === ChainId.SUI ? 'txblock' : 'tx'
    const defaultAddressPath =
      resolvedChain?.id === ChainId.SUI ? 'coin' : 'address'
    const txPath =
      typeof explorerUrl === 'string'
        ? defaultTxPath
        : explorerUrl.txPath || defaultTxPath
    const addressPath =
      typeof explorerUrl === 'string'
        ? defaultAddressPath
        : explorerUrl.addressPath || defaultAddressPath

    return {
      url: sanitiseBaseUrl(url),
      txPath,
      addressPath,
    }
  }

  const getTransactionLink = ({
    txHash,
    txLink,
    chain,
  }: TransactionLinkProps) => {
    if (!txHash && txLink) {
      return txLink
    }

    const config = getExplorerConfig(chain)
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
