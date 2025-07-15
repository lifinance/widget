import { Box } from '@mui/material'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useHasChainExpansion } from '../../hooks/useHasChainExpansion'
import { ExpansionType } from '../../types/widget'
import { ChainsExpanded } from '../Chains/ChainsExpanded'
import { chainExpansionWidth } from '../Chains/ChainsExpanded.style'
import { RoutesExpanded } from '../Routes/RoutesExpanded'
import { routesExpansionWidth } from '../Routes/RoutesExpanded.style'
import { animationDuration } from './ExpansionTransition'

export function Expansion() {
  const [withChainExpansion, expansionType] = useHasChainExpansion()
  const chainExpansionTypeRef = useRef<ExpansionType>(expansionType)

  const [routesOpen, setRoutesOpen] = useState(false)

  const handleSetRoutesOpen = useCallback((open: boolean) => {
    setRoutesOpen(open)
  }, [])

  // Track the previous chain expansion type to avoid re-renders when transitioning to Routes
  if (
    expansionType === ExpansionType.FromChain ||
    expansionType === ExpansionType.ToChain
  ) {
    chainExpansionTypeRef.current = expansionType
  }

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
        marginLeft: boxWidth !== '0px' ? '24px' : '0px',
      }}
    >
      <RoutesExpanded
        expansionType={expansionType}
        setOpenExpansion={handleSetRoutesOpen}
      />
      <ChainsExpanded
        formType={
          chainExpansionTypeRef.current === ExpansionType.FromChain
            ? 'from'
            : 'to'
        }
        open={withChainExpansion}
      />
    </Box>
  )
}
