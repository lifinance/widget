import { ChainType } from '@lifi/sdk'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Slide,
  Typography,
} from '@mui/material'
import type { MouseEventHandler } from 'react'
import { memo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLongPress } from '../../hooks/useLongPress.js'
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js'
import { shortenAddress } from '../../utils/wallet.js'
import { ListItemButton } from '../ListItem/ListItemButton.js'
import { IconButton, ListItem } from './TokenList.style.js'
import type {
  TokenListItemAvatarProps,
  TokenListItemButtonProps,
  TokenListItemProps,
} from './types.js'

export const TokenListItem: React.FC<TokenListItemProps> = memo(
  ({
    onClick,
    size,
    start,
    token,
    chain,
    accountAddress,
    isBalanceLoading,
    startAdornment,
    endAdornment,
    selected,
    onShowTokenDetails,
  }) => {
    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation()
      onClick?.(token.address, chain?.id)
    }
    return (
      <ListItem
        style={{
          height: `${size}px`,
          transform: `translateY(${start}px)`,
          padding: 0,
        }}
      >
        {startAdornment}
        <TokenListItemButton
          token={token}
          chain={chain}
          accountAddress={accountAddress}
          isBalanceLoading={isBalanceLoading}
          onClick={handleClick}
          selected={selected}
          onShowTokenDetails={onShowTokenDetails}
        />
        {endAdornment}
      </ListItem>
    )
  }
)

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

interface OpenTokenDetailsButtonProps {
  tokenAddress: string | undefined
  withoutContractAddress: boolean
  onClick: (tokenAddress: string, withoutContractAddress: boolean) => void
}

const OpenTokenDetailsButton = ({
  tokenAddress,
  withoutContractAddress,
  onClick,
}: OpenTokenDetailsButtonProps) => {
  if (!tokenAddress) {
    return null
  }
  return (
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation()
        e.currentTarget.blur() // Remove focus to prevent accessibility issues when opening drawer
        onClick(tokenAddress, withoutContractAddress)
      }}
    >
      <InfoOutlinedIcon />
    </IconButton>
  )
}

export const TokenListItemButton: React.FC<TokenListItemButtonProps> = ({
  onClick,
  token,
  chain,
  accountAddress,
  isBalanceLoading,
  selected,
  onShowTokenDetails,
}) => {
  const { t } = useTranslation()
  const container = useRef(null)
  const timeoutId = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [showAddress, setShowAddress] = useState(false)

  const withoutContractAddress = chain?.chainType === ChainType.UTXO

  const onMouseEnter = () => {
    timeoutId.current = setTimeout(() => {
      if (token.address) {
        setShowAddress(true)
      }
    }, 350)
  }

  const onMouseLeave = () => {
    clearTimeout(timeoutId.current)
    if (showAddress) {
      setShowAddress(false)
    }
  }

  const tokenAmount = formatTokenAmount(token.amount, token.decimals)
  const tokenPrice = formatTokenPrice(
    token.amount,
    token.priceUSD,
    token.decimals
  )

  const longPressEvents = useLongPress(() =>
    onShowTokenDetails(token.address, withoutContractAddress)
  )

  return (
    <ListItemButton
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...longPressEvents}
      dense
      selected={selected}
      sx={{
        height: 60,
        marginBottom: '4px',
      }}
    >
      <ListItemAvatar>
        <TokenListItemAvatar token={token} />
      </ListItemAvatar>
      <ListItemText
        primary={token.symbol}
        slotProps={{
          secondary: {
            component: 'div',
          },
        }}
        secondary={
          withoutContractAddress ? (
            <Box
              ref={container}
              sx={{
                height: 20,
                display: 'flex',
              }}
            >
              <Box
                sx={{
                  pt: 0.25,
                }}
              >
                {token.name}
              </Box>
              <Box
                sx={{
                  position: 'relative',
                }}
              >
                <Slide
                  direction="up"
                  in={showAddress}
                  container={container.current}
                  style={{
                    position: 'absolute',
                  }}
                  appear={false}
                  mountOnEnter
                >
                  <Box
                    sx={{
                      display: 'flex',
                    }}
                  >
                    <OpenTokenDetailsButton
                      tokenAddress={token.address}
                      withoutContractAddress={withoutContractAddress}
                      onClick={onShowTokenDetails}
                    />
                  </Box>
                </Slide>
              </Box>
            </Box>
          ) : (
            <Box
              ref={container}
              sx={{
                position: 'relative',
                height: 20,
              }}
            >
              <Slide
                direction="down"
                in={!showAddress}
                container={container.current}
                style={{
                  position: 'absolute',
                }}
                appear={false}
              >
                <Box
                  sx={{
                    pt: 0.25,
                  }}
                >
                  {token.name}
                </Box>
              </Slide>
              <Slide
                direction="up"
                in={showAddress}
                container={container.current}
                style={{
                  position: 'absolute',
                }}
                appear={false}
                mountOnEnter
              >
                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      pt: 0.125,
                    }}
                  >
                    {shortenAddress(token.address)}
                  </Box>
                  <OpenTokenDetailsButton
                    tokenAddress={token.address}
                    withoutContractAddress={withoutContractAddress}
                    onClick={onShowTokenDetails}
                  />
                </Box>
              </Slide>
            </Box>
          )
        }
      />
      {accountAddress ? (
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
    </ListItemButton>
  )
}

export const TokenListItemSkeleton = () => {
  return (
    <ListItem
      secondaryAction={<TokenAmountSkeleton />}
      disablePadding
      sx={{
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
      }}
    >
      <ListItemAvatar>
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          sx={{ marginLeft: 1.5, marginRight: 2 }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant="text" width={56} height={24} />}
        secondary={<Skeleton variant="text" width={96} height={16} />}
      />
    </ListItem>
  )
}

export const TokenAmountSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <Skeleton variant="text" width={56} height={24} />
      <Skeleton variant="text" width={48} height={16} />
    </Box>
  )
}
