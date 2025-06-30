import { Box, styled } from '@mui/material'
import { Card } from '../../components/Card/Card.js'
import { maxChainsToShow } from '../../stores/chains/createChainOrderStore.js'

const chainCardWidthPx = 52
const chainCardHeightPx = 56

// Chain grid layout settings:
// These should remain consistent with `maxChainsToShow` to ensure
// proper row/column distribution in the grid layout logic.
const maxRows = 2
const maxChainsPerRow = Math.ceil(maxChainsToShow / maxRows)

export const ChainCard = styled(Card)(() => ({
  display: 'grid',
  placeItems: 'center',
  minWidth: chainCardWidthPx,
  height: chainCardHeightPx,
}))

export const ChainContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'itemCount',
})<{ itemCount: number }>(({ theme, itemCount }) => {
  const rowCount = Math.min(Math.ceil(itemCount / maxChainsPerRow), maxRows)
  const columnsPerRow = Math.ceil(itemCount / rowCount)
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${rowCount > 1 ? columnsPerRow : 'auto-fit'}, minmax(${chainCardWidthPx}px, 1fr))`,
    gridTemplateRows: `repeat(${rowCount}, ${chainCardHeightPx}px)`,
    justifyContent: 'space-between',
    gap: theme.spacing(1.5),
  }
})
