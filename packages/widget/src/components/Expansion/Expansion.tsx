import { Collapse } from '@mui/material'
import type { PropsWithChildren } from 'react'
import type { RouteObject } from 'react-router-dom'
import { useRoutes as useDOMRoutes } from 'react-router-dom'
import { animationTimeout } from '../../config/constants'
import { useSwapOnly } from '../../hooks/useSwapOnly'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import { HiddenUI } from '../../types/widget'
import { navigationRoutes } from '../../utils/navigationRoutes'
import { SelectChainExpansion } from '../Chains/SelectChainExpansion'
import { RoutesExpanded } from '../Routes/RoutesExpanded'
import { CollapseContainer, ExpansionTopLevelGrow } from './Expansion.style'

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

  const { hiddenUI } = useWidgetConfig()
  const swapOnly = useSwapOnly()

  const withChainExpansion =
    (expansionType === ExpansionType.FromChain ||
      expansionType === ExpansionType.ToChain) &&
    !(swapOnly && expansionType === ExpansionType.ToChain) &&
    !hiddenUI?.includes(HiddenUI.ChainSelect)

  return (
    <CollapseContainer>
      <Collapse timeout={animationTimeout} in={match} orientation="horizontal">
        <ExpansionTopLevelGrow
          timeout={animationTimeout}
          in={match}
          mountOnEnter
          unmountOnExit
        >
          <div>
            {expansionType === ExpansionType.Routes && <RoutesExpanded />}
            {withChainExpansion && (
              <SelectChainExpansion
                formType={
                  expansionType === ExpansionType.FromChain ? 'from' : 'to'
                }
              />
            )}
          </div>
        </ExpansionTopLevelGrow>
      </Collapse>
    </CollapseContainer>
  )
}
