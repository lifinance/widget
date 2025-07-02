import type { ExtendedChain } from '@lifi/sdk'
import { useCallback } from 'react'
import { useExpansionRoutes } from '../../hooks/useExpansionRoutes'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import { ExpansionType } from '../../types/widget'
import { getWidgetMaxHeight } from '../../utils/widgetSize'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { CustomTransition } from '../Expansion/CustomTransition'
import {
  SelectChainExpansionContainer,
  chainExpansionWidth,
} from './ChainsExpanded.style'
import { SelectChainContent } from './SelectChainContent'

interface ChainsExpandedProps {
  open: boolean
}

export const ChainsExpanded = ({ open }: ChainsExpandedProps) => {
  const expansionType = useExpansionRoutes()
  const { theme } = useWidgetConfig()

  const formType = expansionType === ExpansionType.FromChain ? 'from' : 'to'

  const { setCurrentChain } = useChainSelect(formType)
  const onSelect = useCallback(
    (chain: ExtendedChain) => {
      setCurrentChain(chain.id)
    },
    [setCurrentChain]
  )

  return (
    <CustomTransition in={open} width={chainExpansionWidth}>
      <SelectChainExpansionContainer
        expansionHeight={getWidgetMaxHeight(theme)}
      >
        <SelectChainContent
          inExpansion
          formType={formType}
          onSelect={onSelect}
        />
      </SelectChainExpansionContainer>
    </CustomTransition>
  )
}
