import type { RouteExtended, TokenAmount } from '@lifi/sdk'
import { Box, Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { Token } from '../../components/Token/Token.js'
import { TokenDivider } from '../../components/Token/Token.style.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'

export const TransactionHistoryItem: React.FC<{
  route: RouteExtended
  type: 'local' | 'history'
  transactionHash: string
  // startedAt in ms
  startedAt: number
}> = memo(({ route, type, transactionHash, startedAt }) => {
  const { i18n } = useTranslation()
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({
      to: navigationRoutes.transactionDetails,
      search: type === 'history' ? { transactionHash } : { routeId: route.id },
    })
  }

  const startedAtDate = new Date(startedAt)

  const fromToken: TokenAmount = {
    ...route.fromToken,
    amount: BigInt(route.fromAmount ?? '0'),
    priceUSD: route.fromToken.priceUSD ?? '0',
    symbol: route.fromToken.symbol ?? '',
    decimals: route.fromToken.decimals ?? 0,
    name: route.fromToken.name ?? '',
    chainId: route.fromToken.chainId,
  }

  const toToken: TokenAmount = {
    ...route.toToken,
    amount: BigInt(route.toAmount ?? '0'),
    priceUSD: route.toToken.priceUSD ?? '0',
    symbol: route.toToken.symbol ?? '',
    decimals: route.toToken.decimals ?? 0,
    name: route.toToken.name ?? '',
    chainId: route.toToken.chainId,
  }

  return (
    <Card onClick={handleClick} indented>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
          }}
        >
          {startedAtDate.toLocaleString(i18n.language, { dateStyle: 'long' })}
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
          }}
        >
          {startedAtDate.toLocaleString(i18n.language, {
            timeStyle: 'short',
          })}
        </Typography>
      </Box>
      <Box>
        <Token token={fromToken} />
        <Box
          sx={{
            pl: 2.375,
            py: 0.5,
          }}
        >
          <TokenDivider />
        </Box>
        <Token token={toToken} />
      </Box>
    </Card>
  )
})
