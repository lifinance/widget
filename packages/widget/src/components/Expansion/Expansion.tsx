import { Box } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { useHasChainExpansion } from '../../hooks/useHasChainExpansion'
import { ExpansionType } from '../../types/widget'
import { ChainsExpanded } from '../Chains/ChainsExpanded'
import { chainExpansionWidth } from '../Chains/ChainsExpanded.style'
import { RoutesExpanded } from '../Routes/RoutesExpanded'
import { routesExpansionWidth } from '../Routes/RoutesExpanded.style'
import { animationDuration } from './ExpansionTransition'

export function Expansion() {
  const [withChainExpansion, expansionType] = useHasChainExpansion()

  const [routesOpen, setRoutesOpen] = useState(false)

  const handleSetRoutesOpen = useCallback((open: boolean) => {
    setRoutesOpen(open)
  }, [])

  const boxWidth = useMemo(() => {
    return routesOpen
      ? routesExpansionWidth
      : withChainExpansion
        ? chainExpansionWidth
        : '0px'
  }, [routesOpen, withChainExpansion])

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        transition: `width ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        width: boxWidth,
        willChange: 'width',
      }}
    >
      <RoutesExpanded
        expansionType={expansionType}
        setOpenExpansion={handleSetRoutesOpen}
      />
      <ChainsExpanded
        formType={expansionType === ExpansionType.FromChain ? 'from' : 'to'}
        open={withChainExpansion}
      />
    </Box>
  )
}
