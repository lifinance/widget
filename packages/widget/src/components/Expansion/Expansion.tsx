import { Box } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { useExpansionRoutes } from '../../hooks/useExpansionRoutes'
import { useHasChainExpansion } from '../../hooks/useHasChainExpansion'
import { ExpansionType } from '../../types/widget'
import { ChainsExpanded } from '../Chains/ChainsExpanded'
import { chainExpansionWidth } from '../Chains/ChainsExpanded.style'
import { RoutesExpanded } from '../Routes/RoutesExpanded'
import { routesExpansionWidth } from '../Routes/RoutesExpanded.style'
import { animationDuration } from './CustomTransition'

export function Expansion() {
  const expansionType = useExpansionRoutes()
  const withChainExpansion = useHasChainExpansion()

  const [routesOpen, setRoutesOpen] = useState(false)

  // Memoize the setter function to prevent unnecessary re-renders
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
        marginLeft: '24px',
        transition: `width ${animationDuration}ms ease-in-out`,
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
