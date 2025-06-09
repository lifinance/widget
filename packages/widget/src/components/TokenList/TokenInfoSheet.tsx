import Close from '@mui/icons-material/Close'
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import { Box, IconButton, Link, Skeleton, Typography } from '@mui/material'
import { type MouseEvent, type PropsWithChildren, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheet } from '../../components/BottomSheet/BottomSheet.js'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useTokenSearch } from '../../hooks/useTokenSearch.js'
import { formatTokenPrice } from '../../utils/format.js'
import { shortenAddress } from '../../utils/wallet.js'
import { TokenAvatar } from '../Avatar/TokenAvatar.js'
import type { BottomSheetBase } from '../BottomSheet/types.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import {
  Label,
  MetricContainer,
  TokenInfoSheetContainer,
  TokenInfoSheetHeader,
} from './TokenInfoSheet.style.js'

interface TokenInfoSheetProps {
  tokenAddress: string
  chainId?: number
  onClose: (e: MouseEvent) => void
}

const NO_DATA_INDICATOR = '-'

export const TokenInfoSheet = forwardRef<BottomSheetBase, TokenInfoSheetProps>(
  ({ tokenAddress, chainId, onClose }, ref) => {
    const { t } = useTranslation()
    const { getAddressLink } = useExplorer()
    const { getChainById } = useAvailableChains()

    const { token, isLoading } = useTokenSearch(chainId, tokenAddress)
    const chain = getChainById(chainId)

    const copyContractAddress = async (e: React.MouseEvent) => {
      e.stopPropagation()
      try {
        await navigator.clipboard.writeText(tokenAddress || '')
      } catch {
        // Do nothing if copy fails
      }
    }

    return (
      <BottomSheet ref={ref}>
        <TokenInfoSheetContainer>
          <TokenInfoSheetHeader>
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
                sx={{
                  '& .MuiBadge-badge': {
                    width: '28px',
                    height: '28px',
                    '& .MuiAvatar-root': {
                      width: '28px',
                      height: '28px',
                    },
                  },
                  '& .MuiAvatar-root': {
                    width: '72px',
                    height: '72px',
                  },
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '32px',
                    color: 'text.primary',
                  }}
                >
                  {token?.symbol || NO_DATA_INDICATOR}
                </Typography>
                <Label>{token?.name || NO_DATA_INDICATOR}</Label>
              </Box>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{ marginTop: '-8px', marginRight: '-8px' }}
            >
              <Close />
            </IconButton>
          </TokenInfoSheetHeader>
          <MetricWithSkeleton
            isLoading={isLoading}
            label={t('tokenMetric.currentPrice')}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '32px',
                lineHeight: '40px',
                color: 'text.primary',
              }}
            >
              {token
                ? t('format.currency', {
                    value: formatTokenPrice(1n, token.priceUSD, token.decimals),
                  })
                : NO_DATA_INDICATOR}
            </Typography>
          </MetricWithSkeleton>
          <MetricWithSkeleton
            isLoading={isLoading}
            label={t('tokenMetric.contractAddress')}
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
              <CardIconButton size="small" onClick={copyContractAddress}>
                <ContentCopyRounded fontSize="inherit" />
              </CardIconButton>
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
            </Box>
          </MetricWithSkeleton>
        </TokenInfoSheetContainer>
      </BottomSheet>
    )
  }
)

interface MetricWithSkeletonProps {
  label: string
  isLoading: boolean
}

const MetricWithSkeleton = ({
  label,
  isLoading,
  children,
}: PropsWithChildren<MetricWithSkeletonProps>) => {
  return (
    <MetricContainer>
      <Label>{label}</Label>
      {isLoading ? (
        <Skeleton variant="text" width={56} height={24} />
      ) : (
        children
      )}
    </MetricContainer>
  )
}
