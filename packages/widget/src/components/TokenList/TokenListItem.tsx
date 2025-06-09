import { ChainType } from '@lifi/sdk'
import InfoIcon from '@mui/icons-material/Info'
import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Slide,
  Typography,
} from '@mui/material'
import type { MouseEvent, MouseEventHandler } from 'react'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js'
import { shortenAddress } from '../../utils/wallet.js'
import type { BottomSheetBase } from '../BottomSheet/types.js'
import { ListItemButton } from '../ListItem/ListItemButton.js'
import { TokenInfoSheet } from './TokenInfoSheet.js'
import { IconButton, ListItem } from './TokenList.style.js'
import type {
  TokenListItemAvatarProps,
  TokenListItemButtonProps,
  TokenListItemProps,
} from './types.js'

export const TokenListItem: React.FC<TokenListItemProps> = ({
  onClick,
  size,
  start,
  token,
  chain,
  accountAddress,
  isBalanceLoading,
  startAdornment,
  endAdornment,
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
      }}
    >
      {startAdornment}
      <TokenListItemButton
        token={token}
        chain={chain}
        accountAddress={accountAddress}
        isBalanceLoading={isBalanceLoading}
        onClick={handleClick}
      />
      {endAdornment}
    </ListItem>
  )
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

export const TokenListItemButton: React.FC<TokenListItemButtonProps> = ({
  onClick,
  token,
  chain,
  accountAddress,
  isBalanceLoading,
}) => {
  const { t } = useTranslation()
  const tokenInfoSheetRef = useRef<BottomSheetBase>(null)

  const container = useRef(null)
  const timeoutId = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [showAddress, setShowAddress] = useState(false)

  const tokenAddress =
    chain?.chainType === ChainType.UTXO ? accountAddress : token.address

  const onMouseEnter = () => {
    timeoutId.current = setTimeout(() => {
      if (tokenAddress) {
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

  const onShowTokenInfo = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    tokenInfoSheetRef.current?.open()
  }, [])

  const onCloseTokenInfo = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    tokenInfoSheetRef.current?.close()
  }, [])

  const tokenAmount = formatTokenAmount(token.amount, token.decimals)
  const tokenPrice = formatTokenPrice(
    token.amount,
    token.priceUSD,
    token.decimals
  )

  return (
    <ListItemButton
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      dense
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
                  {shortenAddress(tokenAddress)}
                </Box>
                {tokenAddress && (
                  <>
                    <IconButton size="small" onClick={onShowTokenInfo}>
                      <InfoIcon />
                    </IconButton>
                    <TokenInfoSheet
                      ref={tokenInfoSheetRef}
                      chainId={chain?.id}
                      tokenAddress={tokenAddress}
                      onClose={onCloseTokenInfo}
                    />
                  </>
                )}
              </Box>
            </Slide>
          </Box>
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
      sx={{ position: 'relative', flexDirection: 'row', alignItems: 'center' }}
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
