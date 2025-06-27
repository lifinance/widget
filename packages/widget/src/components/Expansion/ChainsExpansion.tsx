import type { ExtendedChain } from '@lifi/sdk'
import { useCallback } from 'react'
import { useExpansionRoutes } from '../../hooks/useExpansionRoutes'
import { useHasChainExpansion } from '../../hooks/useHasChainExpansion'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import { ExpansionType } from '../../types/widget'
import { getWidgetMaxHeight } from '../../utils/widgetSize'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { SelectChainContent } from '../Chains/SelectChainContent'
import {
  SelectChainExpansionContainer,
  chainExpansionWidth,
} from './Expansion.style'
import { ExpansionSlide } from './ExpansionSlide'

export const ChainsExpansion = () => {
  const expansionType = useExpansionRoutes()
  const withChainExpansion = useHasChainExpansion()
  const { theme } = useWidgetConfig()

  const formType = expansionType === ExpansionType.FromChain ? 'from' : 'to'

  const { setCurrentChain } = useChainSelect(formType)
  const onSelect = useCallback(
    (chain: ExtendedChain) => {
      setCurrentChain(chain.id)
    },
    [setCurrentChain]
  )

  const expansionHeight = getWidgetMaxHeight(theme)

  return (
    <ExpansionSlide
      open={withChainExpansion}
      expansionWidth={chainExpansionWidth}
      expansionHeight={`${expansionHeight}${Number.isFinite(expansionHeight) ? 'px' : ''}`}
    >
      <SelectChainExpansionContainer expansionHeight={expansionHeight}>
        <SelectChainContent
          inExpansion
          formType={formType}
          onSelect={onSelect}
        />
      </SelectChainExpansionContainer>
    </ExpansionSlide>
  )
}
