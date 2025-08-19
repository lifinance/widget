import { useMemo, useRef, useState } from 'react'
import { useHasChainExpansion } from '../../hooks/useHasChainExpansion.js'
import { ExpansionType } from '../../types/widget.js'
import { ChainsExpanded } from '../Chains/ChainsExpanded.js'
import { chainExpansionWidth } from '../Chains/ChainsExpanded.style.js'
import { RoutesExpanded } from '../Routes/RoutesExpanded.js'
import { routesExpansionWidth } from '../Routes/RoutesExpanded.style.js'
import { ExpansionContainer } from './Expansion.style.js'

export function Expansion() {
  const [withChainExpansion, expansionType] = useHasChainExpansion()
  const chainExpansionTypeRef = useRef<ExpansionType>(expansionType)
  const [routesOpen, setRoutesOpen] = useState(false)

  // Track the previous chain expansion type to avoid re-renders when transitioning to Routes
  if (
    expansionType === ExpansionType.FromChain ||
    expansionType === ExpansionType.ToChain
  ) {
    chainExpansionTypeRef.current = expansionType
  }

  const containerWidth = useMemo(() => {
    return routesOpen
      ? routesExpansionWidth
      : withChainExpansion
        ? chainExpansionWidth
        : 0
  }, [routesOpen, withChainExpansion])

  return (
    <ExpansionContainer width={containerWidth}>
      <RoutesExpanded
        canOpen={expansionType === ExpansionType.Routes}
        setOpenExpansion={setRoutesOpen}
      />
      <ChainsExpanded
        formType={
          chainExpansionTypeRef.current === ExpansionType.FromChain
            ? 'from'
            : 'to'
        }
        open={withChainExpansion}
      />
    </ExpansionContainer>
  )
}
