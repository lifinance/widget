import { Collapse } from '@mui/material'
import type { PropsWithChildren } from 'react'
import type { RouteObject } from 'react-router-dom'
import { useRoutes as useDOMRoutes } from 'react-router-dom'
import { animationTimeout } from '../../config/constants'
import { navigationRoutes } from '../../utils/navigationRoutes'
import { SelectChainEmbedded } from '../Chains/SelectChainEmbedded'
import { RoutesExpanded } from '../Routes/RoutesExpanded'
import { CollapseContainer, RouteTopLevelGrow } from './Expansion.style'

enum ExpansionType {
  Routes = 'routes',
  FromChain = 'fromChain',
  ToChain = 'toChain',
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: ExpansionType.Routes,
  },
  {
    path: navigationRoutes.fromToken,
    element: ExpansionType.FromChain,
  },
  {
    path: navigationRoutes.toToken,
    element: ExpansionType.ToChain,
  },
  {
    path: '*',
    element: null,
  },
]

export const Expansion = () => {
  const element = useDOMRoutes(routes)
  const expansionType = (element?.props as PropsWithChildren)?.children
  const match = Boolean(expansionType)
  return (
    <CollapseContainer>
      <Collapse timeout={animationTimeout} in={match} orientation="horizontal">
        <RouteTopLevelGrow
          timeout={animationTimeout}
          in={match}
          mountOnEnter
          unmountOnExit
        >
          <div>
            {expansionType === ExpansionType.Routes && <RoutesExpanded />}
            {expansionType === ExpansionType.FromChain && (
              <SelectChainEmbedded formType={'from'} />
            )}
            {expansionType === ExpansionType.ToChain && (
              <SelectChainEmbedded formType={'to'} />
            )}
          </div>
        </RouteTopLevelGrow>
      </Collapse>
    </CollapseContainer>
  )
}
