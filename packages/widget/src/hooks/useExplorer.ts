import type { Chain, EVMChain } from '@lifi/sdk'
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

  const getBaseUrl = (chain: Chain) => {
    const baseUrl = explorerUrls?.[chain.id]
      ? explorerUrls[chain.id][0]
      : chain.metamask.blockExplorerUrls[0]

    return sanitiseBaseUrl(baseUrl)
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
    if (!chain) {
      const baseUrl = explorerUrls?.internal?.[0]
        ? sanitiseBaseUrl(explorerUrls?.internal[0])
        : lifiExplorerUrl
      return `${baseUrl}/tx/${txHash}`
    }
    const resolvedChain = resolveChain(chain)
    const txPathSegment = resolvedChain?.id === ChainId.SUI ? 'txblock' : 'tx'
    return `${resolvedChain ? getBaseUrl(resolvedChain) : lifiExplorerUrl}/${txPathSegment}/${txHash}`
  }

  const getAddressLink = (address: string, chain?: Chain | number) => {
    if (!chain) {
      const baseUrl = explorerUrls?.internal?.[0]
        ? sanitiseBaseUrl(explorerUrls?.internal[0])
        : lifiExplorerUrl
      return `${baseUrl}/address/${address}`
    }

    const resolvedChain = resolveChain(chain)
    return `${resolvedChain ? getBaseUrl(resolvedChain) : lifiExplorerUrl}/address/${address}`
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
