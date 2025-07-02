import { useState } from 'react'
import { useHasChainExpansion } from '../../hooks/useHasChainExpansion'
import { ChainsExpanded } from '../Chains/ChainsExpanded'
import { chainExpansionWidth } from '../Chains/ChainsExpanded.style'
import { RoutesExpanded } from '../Routes/RoutesExpanded'
import { routesExpansionWidth } from '../Routes/RoutesExpanded.style'

export function Expansion() {
  const withChainExpansion = useHasChainExpansion()

  const [routesOpen, setRoutesOpen] = useState(false)

  return (
    <div
      style={{
        transition: 'width 225ms ease-in-out',
        width: routesOpen
          ? routesExpansionWidth
          : withChainExpansion
            ? chainExpansionWidth
            : '0px',
        position: 'relative',
        marginLeft: '24px',
      }}
    >
      <RoutesExpanded open={routesOpen} setOpenExpansion={setRoutesOpen} />
      <ChainsExpanded open={withChainExpansion} />
    </div>
  )
}
