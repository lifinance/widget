import { memo } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import type { FormType } from '../../stores/form/types'
import { getWidgetMaxHeight } from '../../utils/widgetSize'
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

    return (
      <CustomTransition in={open} width={chainExpansionWidth}>
        <SelectChainExpansionContainer
          expansionHeight={getWidgetMaxHeight(theme)}
        >
          <SelectChainContent inExpansion formType={formType} />
        </SelectChainExpansionContainer>
      </CustomTransition>
    )
  }
)
