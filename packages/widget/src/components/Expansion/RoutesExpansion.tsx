import { Collapse } from '@mui/material'
import { useExpansionRoutes } from '../../hooks/useExpansionRoutes'
import { ExpansionType } from '../../types/widget'
import { RoutesExpanded, animationTimeout } from '../Routes/RoutesExpanded'
import { CollapseContainer, RouteTopLevelGrow } from './RoutesExpansion.style'

export const RoutesExpansion = () => {
  const expansionType = useExpansionRoutes()
  return (
    <CollapseContainer>
      <Collapse
        timeout={animationTimeout}
        in={expansionType === ExpansionType.Routes}
        orientation="horizontal"
      >
        <RouteTopLevelGrow
          timeout={animationTimeout}
          in={expansionType === ExpansionType.Routes}
          mountOnEnter
          unmountOnExit
        >
          <div>
            <RoutesExpanded />
          </div>
        </RouteTopLevelGrow>
      </Collapse>
    </CollapseContainer>
  )
}
