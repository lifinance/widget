import type { ExtendedChain } from '@lifi/sdk'
import { Collapse } from '@mui/material'
import { type PropsWithChildren, useCallback } from 'react'
import type { RouteObject } from 'react-router-dom'
import { useRoutes as useDOMRoutes } from 'react-router-dom'
import { useSwapOnly } from '../../hooks/useSwapOnly'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import { HiddenUI } from '../../types/widget'
import { navigationRoutes } from '../../utils/navigationRoutes'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { SelectChainContent } from '../Chains/SelectChainContent'
import { RoutesExpanded, animationTimeout } from '../Routes/RoutesExpanded'
import {
  CollapseContainer,
  ExpansionTopLevelGrow,
  SelectChainExpansionContainer,
} from './Expansion.style'
import { ExpansionSlide } from './ExpansionSlide'

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

  const formType = expansionType === ExpansionType.FromChain ? 'from' : 'to'
  const { setCurrentChain } = useChainSelect(formType)
  const onSelect = useCallback(
    (chain: ExtendedChain) => {
      setCurrentChain(chain.id)
    },
    [setCurrentChain]
  )

  return (
    <CollapseContainer>
      {expansionType === ExpansionType.Routes && (
        <Collapse
          timeout={animationTimeout}
          in={match}
          orientation="horizontal"
        >
          <ExpansionTopLevelGrow
            timeout={animationTimeout}
            in={match}
            mountOnEnter
            unmountOnExit
          >
            <div>
              <RoutesExpanded />
            </div>
          </ExpansionTopLevelGrow>
        </Collapse>
      )}
      {withChainExpansion && (
        <ExpansionSlide open={withChainExpansion}>
          <SelectChainExpansionContainer>
            <SelectChainContent
              inExpansion
              formType={formType}
              onSelect={onSelect}
            />
          </SelectChainExpansionContainer>
        </ExpansionSlide>
      )}
    </CollapseContainer>
  )
}
