import { Box, styled } from '@mui/material'
import { Card } from '../../components/Card/Card.js'
import { maxChainsToShow } from '../../stores/chains/createChainOrderStore.js'

const chainCardWidthPx = 52
const chainCardHeightPx = 56

// Chain grid layout settings:
// These should remain consistent with `maxChainsToShow` to ensure
// proper row/column distribution in the grid layout logic.
const minChainsPerRow = 2 // instead of 1, to show 2 chains per row when there are 2 chains in total
const maxChainsPerRow = 5
const maxRows = Math.ceil(maxChainsToShow / maxChainsPerRow)

const possibleColumnsPerRow = Array.from(
  { length: maxChainsPerRow - minChainsPerRow + 1 },
  (_, i) => minChainsPerRow + i
)

export const ChainCard = styled(Card)({
  display: 'grid',
  placeItems: 'center',
  minWidth: chainCardWidthPx,
  height: chainCardHeightPx,
})

export const ChainContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'itemCount',
})<{ itemCount: number }>(({ theme, itemCount }) => {
  // Find the best column count to balance rows:
  // - fit within a maximum number of rows
  // - keep rows as balanced as possible (e.g., prefer 3 + 3 over 5 + 1)
  // NB: for itemCount = 2, use 2 columns per row instead of 2 rows of 1 column.
  const columnsPerRow =
    itemCount <= maxChainsPerRow
      ? maxChainsPerRow // if there are less than maxChainsPerRow chains in total, put them all in one row
      : possibleColumnsPerRow
          // Calculate the number of rows for each possible column count based on itemCount,
          // and if the number of rows <= maxRows, find the number of columns with minimum imbalance,
          // otherwise use maxChainsPerRow.
          .filter((cols) => Math.ceil(itemCount / cols) <= maxRows)
          .reduce((best, cols) => {
            const lastRowSize = itemCount % cols || cols
            // Imbalance is how far the last row is from being full
            const imbalance = Math.abs(lastRowSize - cols)
            const bestLastRowSize = itemCount % best || best
            const bestImbalance = Math.abs(bestLastRowSize - best)
            // Choose the column count that creates a less imbalanced last row
            return imbalance < bestImbalance ? cols : best
          }, maxChainsPerRow)

  const rowCount = Math.ceil(itemCount / columnsPerRow)

  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${rowCount > 1 ? columnsPerRow : 'auto-fit'}, minmax(${chainCardWidthPx}px, 1fr))`,
    gridTemplateRows: `repeat(${rowCount}, ${chainCardHeightPx}px)`,
    justifyContent: 'space-between',
    gap: theme.spacing(1.5),
  }
})
