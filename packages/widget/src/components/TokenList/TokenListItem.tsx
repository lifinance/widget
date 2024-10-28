import { ChainType } from '@lifi/sdk'
import { OpenInNewRounded } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Link,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Slide,
  Typography,
} from '@mui/material'
import type { MouseEventHandler } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useExplorer } from '../../hooks/useExplorer.js'
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js'
import { shortenAddress } from '../../utils/wallet.js'
import { ListItemButton } from '../ListItem/ListItemButton.js'
import { IconButton, ListItem } from './TokenList.style.js'
import type { TokenListItemButtonProps, TokenListItemProps } from './types.js'

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

export const TokenListItemButton: React.FC<TokenListItemButtonProps> = ({
  onClick,
  token,
  chain,
  accountAddress,
  isBalanceLoading,
}) => {
  const { t } = useTranslation()
  const { getAddressLink } = useExplorer()

  const tokenPrice = token.amount
    ? formatTokenPrice(
        formatUnits(token.amount, token.decimals),
        token.priceUSD
      )
    : undefined
  const container = useRef(null)
  const timeoutId = useRef<ReturnType<typeof setTimeout>>()
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

  return (
    <ListItemButton
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      dense
    >
      <ListItemAvatar>
        <Avatar src={token.logoURI} alt={token.symbol}>
          {token.symbol?.[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={token.symbol}
        secondaryTypographyProps={{
          component: 'div',
        }}
        secondary={
          <Box position="relative" height={20} ref={container}>
            <Slide
              direction="down"
              in={!showAddress}
              container={container.current}
              style={{
                position: 'absolute',
              }}
              appear={false}
            >
              <Box pt={0.25}>{token.name}</Box>
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
              <Box display="flex">
                <Box display="flex" alignItems="center" pt={0.125}>
                  {shortenAddress(tokenAddress)}
                </Box>
                <IconButton
                  size="small"
                  LinkComponent={Link}
                  href={getAddressLink(tokenAddress!, chain)}
                  target="_blank"
                  rel="nofollow noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <OpenInNewRounded />
                </IconButton>
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
              <Typography fontWeight={600} noWrap>
                {t('format.number', {
                  value: formatTokenAmount(token.amount, token.decimals),
                })}
              </Typography>
            ) : null}
            {tokenPrice ? (
              <Typography
                fontWeight={500}
                fontSize={12}
                color="text.secondary"
                data-price={token.priceUSD}
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
