import type { Chain } from '@lifi/sdk'
import { ChainId, ChainType, isHex } from '@lifi/sdk'
import { useCallback } from 'react'
import { internalExplorerUrl } from '../config/constants.js'
import { useAvailableChains } from '../hooks/useAvailableChains.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'

const sanitiseBaseUrl = (baseUrl: string) => baseUrl.trim().replace(/\/+$/, '')

const explorerPathOverrides: Partial<
  Record<ChainType | ChainId, { txPath: string; addressPath: string }>
> = {
  [ChainId.SUI]: { txPath: 'txblock', addressPath: 'coin' },
  [ChainId.LTR]: { txPath: 'logs', addressPath: 'accounts' },
  [ChainType.TVM]: { txPath: '#/transaction', addressPath: '#/address' },
}

type TransactionLinkProps = {
  chain?: Chain | number
  txHash?: string
  txLink?: string
}

export const useExplorer = (): {
  getTransactionLink: (props: TransactionLinkProps) => string | undefined
  getAddressLink: (address: string, chain?: Chain | number) => string
} => {
  const { explorerUrls } = useWidgetConfig()
  const { getChainById } = useAvailableChains()

  const getExplorerConfig = useCallback(
    (chain?: Chain | number) => {
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
        hasOverride: Boolean(overrides),
      }
    },
    [explorerUrls, getChainById]
  )

  const getTransactionLink = useCallback(
    ({ txHash, txLink, chain }: TransactionLinkProps): string | undefined => {
      if (txHash) {
        const config = getExplorerConfig(chain)
        // For EVM chains, sanity-check the transaction hash as some relayers return custom task hashes that are not visible on-chain.
        // Skip the check when a chain-specific path override is registered — that's an explicit signal the chain's
        // explorer accepts a non-hex hash (e.g. Lighter, whose hash has no 0x prefix).
        const validForEvm =
          config.resolvedChain?.chainType !== ChainType.EVM ||
          config.hasOverride ||
          isHex(txHash, { strict: true })
        if (validForEvm) {
          return `${config.url}/${config.txPath}/${txHash}`
        }
      }
      return txLink
    },
    [getExplorerConfig]
  )

  const getAddressLink = useCallback(
    (address: string, chain?: Chain | number) => {
      const config = getExplorerConfig(chain)
      return `${config.url}/${config.addressPath}/${address}`
    },
    [getExplorerConfig]
  )

  return {
    getTransactionLink,
    getAddressLink,
  }
}
