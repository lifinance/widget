import type { Chain, EVMChain } from '@lifi/sdk'
import { ChainId } from '@lifi/sdk'
import { lifiExplorerUrl } from '../config/constants.js'
import { useAvailableChains } from '../hooks/useAvailableChains.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { ExplorerUrl } from '../types/widget.js'

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

  const getExplorerConfig = (
    explorerUrl?: ExplorerUrl,
    chain?: Chain
  ) => {
    if (!explorerUrl) {
      return
    }

    const url = typeof explorerUrl === 'string' ? explorerUrl : explorerUrl.url

    const defaultTxPath = chain?.id === ChainId.SUI ? 'txblock' : 'tx'
    const txPath =
      typeof explorerUrl === 'string'
        ? defaultTxPath
        : explorerUrl.txPath || defaultTxPath
    const addressPath =
      typeof explorerUrl === 'string'
        ? 'address'
        : explorerUrl.addressPath || 'address'

    return {
      url: sanitiseBaseUrl(url),
      txPath,
      addressPath,
    }
  }

  const getBaseUrl = (chain: Chain) => {
    const explorerUrl =
      explorerUrls?.[chain.id]?.[0] ?? chain.metamask.blockExplorerUrls[0]
    return getExplorerConfig(explorerUrl, chain)
  }

  const resolveChain = (chain: Chain | number) =>
    Number.isFinite(chain) ? getChainById(chain as number) : (chain as Chain)

  const getTransactionLink = ({
    txHash,
    txLink,
    chain,
  }: TransactionLinkProps) => {
    if (!txHash && txLink) {
      return txLink
    }

    const resolvedChain = chain ? resolveChain(chain) : null
    const config = resolvedChain
      ? getBaseUrl(resolvedChain)
      : getExplorerConfig(explorerUrls?.internal?.[0])

    if (!config) {
      return `${lifiExplorerUrl}/tx/${txHash}`
    }

    return `${config.url}/${config.txPath}/${txHash}`
  }

  const getAddressLink = (address: string, chain?: Chain | number) => {
    const resolvedChain = chain ? resolveChain(chain) : null
    const config = resolvedChain
      ? getBaseUrl(resolvedChain)
      : getExplorerConfig(explorerUrls?.internal?.[0])

    if (!config) {
      return `${lifiExplorerUrl}/address/${address}`
    }
    return `${config.url}/${config.addressPath}/${address}`
  }

  const getTokenAddressLink = (address: string, chain?: Chain | number) => {
    const link = getAddressLink(address, chain)
    if (chain === ChainId.SUI || (chain as EVMChain)?.id === ChainId.SUI) {
      return link.replace('address', 'coin')
    }
    return link
  }

  return {
    getTransactionLink,
    getAddressLink,
    getTokenAddressLink,
  }
}
