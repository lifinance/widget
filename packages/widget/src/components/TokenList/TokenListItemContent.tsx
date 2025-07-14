import type { ExtendedChain, StaticToken } from '@lifi/sdk'
import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material'
import { type ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { NetworkAmount, TokenAmount } from '../../types/token'
import { TokenAvatar } from '../Avatar/TokenAvatar'
import { TokenAmountSkeleton } from './TokenListItemSkeleton'

interface TokenListItemContentProps {
  token: TokenAmount | NetworkAmount
  chain?: ExtendedChain
  secondaryNode: ReactNode
  showBalance: boolean
  isBalanceLoading: boolean
  tokenAmount?: string
  tokenPrice?: number
}

export const TokenListItemContent = ({
  token,
  chain,
  secondaryNode,
  showBalance,
  isBalanceLoading,
  tokenAmount,
  tokenPrice,
}: TokenListItemContentProps) => {
  const { t } = useTranslation()
  return (
    <>
      <ListItemAvatar>
        {chain ? (
          <TokenAvatar
            token={token as StaticToken}
            chain={chain}
            tokenAvatarSize={40}
            chainAvatarSize={16}
          />
        ) : (
          <TokenListItemAvatar token={token} />
        )}
      </ListItemAvatar>
      <ListItemText
        primary={token.symbol}
        slotProps={{
          secondary: {
            component: 'div',
          },
        }}
        secondary={secondaryNode}
      />
      {showBalance ? (
        isBalanceLoading ? (
          <TokenAmountSkeleton />
        ) : (
          <Box sx={{ textAlign: 'right' }}>
            {token.amount ? (
              <Typography
                noWrap
                sx={{
                  fontWeight: 600,
                }}
                title={tokenAmount}
              >
                {t('format.tokenAmount', {
                  value: tokenAmount,
                })}
              </Typography>
            ) : null}
            {tokenPrice ? (
              <Typography
                data-price={token.priceUSD}
                sx={{
                  fontWeight: 500,
                  fontSize: 12,
                  color: 'text.secondary',
                }}
              >
                {t('format.currency', {
                  value: tokenPrice,
                })}
              </Typography>
            ) : null}
          </Box>
        )
      ) : null}
    </>
  )
}

export interface TokenListItemAvatarProps {
  token: TokenAmount | NetworkAmount
}

export const TokenListItemAvatar: React.FC<TokenListItemAvatarProps> = ({
  token,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true)
  return (
    <Avatar
      src={token.logoURI}
      alt={token.symbol}
      sx={(theme) =>
        isImageLoading ? { bgcolor: theme.vars.palette.grey[300] } : null
      }
      onLoad={() => setIsImageLoading(false)}
    >
      {token.symbol?.[0]}
    </Avatar>
  )
}
