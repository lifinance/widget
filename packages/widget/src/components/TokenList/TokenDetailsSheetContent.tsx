import Close from '@mui/icons-material/Close'
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import { Box, IconButton, Link, Skeleton, Typography } from '@mui/material'
import { forwardRef, type PropsWithChildren, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useTokenSearch } from '../../hooks/useTokenSearch.js'
import { formatAmount, formatTokenPrice } from '../../utils/format.js'
import { shortenAddress } from '../../utils/wallet.js'
import { TokenAvatar } from '../Avatar/TokenAvatar.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import {
  Label,
  MetricContainer,
  TokenDetailsSheetContainer,
  TokenDetailsSheetHeader,
} from './TokenDetailsSheetContent.style.js'
import type { TokenDetailsSheetBase } from './types.js'

interface TokenDetailsSheetContentProps {
  tokenAddress: string | undefined
  chainId: number | undefined
  withoutContractAddress: boolean
}

const noDataLabel = '-'

export const TokenDetailsSheetContent = forwardRef<
  TokenDetailsSheetBase,
  TokenDetailsSheetContentProps
>(({ tokenAddress, chainId, withoutContractAddress }, ref) => {
  const { t } = useTranslation()
  const { getAddressLink } = useExplorer()
  const { getChainById } = useAvailableChains()

  const { token, isLoading } = useTokenSearch(
    chainId,
    tokenAddress,
    !!tokenAddress
  )
  const chain = useMemo(() => getChainById(chainId), [chainId, getChainById])

  const copyContractAddress = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      // Clipboard API may throw if access is denied (e.g., in insecure contexts or older browsers)
      await navigator.clipboard.writeText(tokenAddress || '')
    } catch {
      // Silently fail to avoid crashing the UI if clipboard write fails
    }
  }

  return (
    <TokenDetailsSheetContainer>
      <TokenDetailsSheetHeader>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <TokenAvatar
            token={token}
            chain={chain}
            tokenAvatarSize={72}
            chainAvatarSize={28}
            isLoading={isLoading}
          />
          <MetricContainer>
            {isLoading ? (
              <>
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={80} height={16} />
              </>
            ) : (
              <>
                <Typography
                  fontWeight={700}
                  fontSize="24px"
                  lineHeight="24px"
                  color="text.primary"
                >
                  {token?.symbol || noDataLabel}
                </Typography>
                <Label>{token?.name || noDataLabel}</Label>
              </>
            )}
          </MetricContainer>
        </Box>
        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            if (ref && typeof ref !== 'function') {
              ref.current?.close()
            }
          }}
          sx={{ mt: '-8px', mr: '-8px' }}
        >
          <Close />
        </IconButton>
      </TokenDetailsSheetHeader>
      <MetricWithSkeleton
        isLoading={isLoading}
        label={t('tokenMetric.currentPrice')}
        width={200}
        height={40}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '32px',
            lineHeight: '40px',
            color: 'text.primary',
          }}
        >
          {token?.priceUSD
            ? t('format.currency', {
                value: formatTokenPrice('1', token.priceUSD, token.decimals),
              })
            : noDataLabel}
        </Typography>
      </MetricWithSkeleton>
      {!withoutContractAddress && (
        <MetricWithSkeleton
          isLoading={isLoading}
          label={t('tokenMetric.contractAddress')}
          width={200}
          height={24}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '18px',
                lineHeight: '24px',
                color: 'text.primary',
              }}
            >
              {shortenAddress(tokenAddress)}
            </Typography>
            {tokenAddress && (
              <CardIconButton size="small" onClick={copyContractAddress}>
                <ContentCopyRounded fontSize="inherit" />
              </CardIconButton>
            )}
            {tokenAddress && (
              <CardIconButton
                size="small"
                LinkComponent={Link}
                href={getAddressLink(tokenAddress, chainId)}
                target="_blank"
                rel="nofollow noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <OpenInNewRounded fontSize="inherit" />
              </CardIconButton>
            )}
          </Box>
        </MetricWithSkeleton>
      )}
      <MetricWithSkeleton
        isLoading={isLoading}
        label={t('tokenMetric.marketCap')}
        width={200}
        height={24}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '24px',
            color: 'text.primary',
          }}
        >
          {token?.marketCapUSD
            ? t('format.currencyShort', {
                value: formatAmount(token.marketCapUSD),
              })
            : noDataLabel}
        </Typography>
      </MetricWithSkeleton>
      <MetricWithSkeleton
        isLoading={isLoading}
        label={t('tokenMetric.volume24h')}
        width={200}
        height={24}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '24px',
            color: 'text.primary',
          }}
        >
          {token?.volumeUSD24H
            ? t('format.currencyShort', {
                value: formatAmount(token.volumeUSD24H),
              })
            : noDataLabel}
        </Typography>
      </MetricWithSkeleton>
    </TokenDetailsSheetContainer>
  )
})

interface MetricWithSkeletonProps {
  label: string
  isLoading: boolean
  width: number
  height: number
}

const MetricWithSkeleton = ({
  label,
  width,
  height,
  isLoading,
  children,
}: PropsWithChildren<MetricWithSkeletonProps>) => {
  return (
    <MetricContainer>
      <Label>{label}</Label>
      {isLoading ? (
        <Skeleton variant="rounded" width={width} height={height} />
      ) : (
        children
      )}
    </MetricContainer>
  )
}
