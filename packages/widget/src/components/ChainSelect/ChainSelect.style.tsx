import { Avatar, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Card } from '../../components/Card/Card.js'
import { maxChainsToShow } from '../../stores/chains/createChainOrderStore.js'

const chainCardWidthPx = 52
const chainCardHeightPx = 56
// For mobile screens (xs, under 360px)
const chainCardHeightPxMobile = 36

// Chain grid layout settings:
// These should remain consistent with `maxChainsToShow` to ensure
// proper row/column distribution in the grid layout logic.
const maxRows = 2
const maxChainsPerRow = Math.ceil(maxChainsToShow / maxRows)
// For mobile screens (xs, under 360px)
const maxRowsMobile = 3
const maxChainsPerRowMobile = Math.ceil(maxChainsToShow / maxRowsMobile)

export const ChainCard = styled(Card)(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  minWidth: chainCardWidthPx,
  height: chainCardHeightPx,
  [theme.breakpoints.down(theme.breakpoints.values.xs)]: {
    height: chainCardHeightPxMobile,
  },
}))

export const ChainAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  [theme.breakpoints.down(theme.breakpoints.values.xs)]: {
    width: 28,
    height: 28,
  },
}))

export const MoreChainsBox = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'grid',
  placeItems: 'center',
  [theme.breakpoints.down(theme.breakpoints.values.xs)]: {
    width: 28,
    height: 28,
  },
}))

export const ChainContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'itemCount',
})<{ itemCount: number }>(({ theme, itemCount }) => {
  const rowCount = Math.min(Math.ceil(itemCount / maxChainsPerRow), maxRows)
  const columnsPerRow = Math.ceil(itemCount / rowCount)
  const rowCountMobile = Math.min(
    Math.ceil(itemCount / maxChainsPerRowMobile),
    maxRowsMobile
  )
  const columnsPerRowMobile = Math.ceil(itemCount / rowCountMobile)
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${rowCount > 1 ? columnsPerRow : 'auto-fit'}, minmax(${chainCardWidthPx}px, 1fr))`,
    gridTemplateRows: `repeat(${rowCount}, ${chainCardHeightPx}px)`,
    justifyContent: 'space-between',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down(theme.breakpoints.values.xs)]: {
      gridTemplateColumns: `repeat(${rowCountMobile > 1 ? columnsPerRowMobile : 'auto-fit'}, minmax(${chainCardWidthPx}px, 1fr))`,
      gridTemplateRows: `repeat(${rowCountMobile}, ${chainCardHeightPxMobile}px)`,
      gap: theme.spacing(1),
    },
  }
})
