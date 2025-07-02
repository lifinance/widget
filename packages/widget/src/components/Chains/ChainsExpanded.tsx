import type { ExtendedChain } from '@lifi/sdk'
import { memo, useCallback } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import type { FormType } from '../../stores/form/types'
import { getWidgetMaxHeight } from '../../utils/widgetSize'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { CustomTransition } from '../Expansion/CustomTransition'
import {
  SelectChainExpansionContainer,
  chainExpansionWidth,
} from './ChainsExpanded.style'
import { SelectChainContent } from './SelectChainContent'

interface ChainsExpandedProps {
  formType: FormType
  open: boolean
}

export const ChainsExpanded = memo(
  ({ formType, open }: ChainsExpandedProps) => {
    const { theme } = useWidgetConfig()

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
)
