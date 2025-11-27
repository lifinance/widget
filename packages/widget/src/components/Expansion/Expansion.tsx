import { useMemo, useRef, useState } from 'react'
import { useHasChainExpansion } from '../../hooks/useHasChainExpansion'
import { ExpansionType } from '../../types/widget'
import { ChainsExpanded } from '../Chains/ChainsExpanded'
import { chainExpansionWidth } from '../Chains/ChainsExpanded.style'
import { RoutesExpanded } from '../Routes/RoutesExpanded'
import { routesExpansionWidth } from '../Routes/RoutesExpanded.style'
import { ExpansionContainer } from './Expansion.style'

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
