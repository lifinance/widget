import { memo } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../../stores/form/types.js'
import { getWidgetMaxHeight } from '../../utils/widgetSize.js'
import { ExpansionTransition } from '../Expansion/ExpansionTransition.js'
import {
  chainExpansionWidth,
  SelectChainExpansionContainer,
} from './ChainsExpanded.style.js'
import { SelectChainContent } from './SelectChainContent.js'

interface ChainsExpandedProps {
  formType: FormType
  open: boolean
}

export const ChainsExpanded = memo(function ChainsExpanded({
  formType,
  open,
}: ChainsExpandedProps) {
  const { theme } = useWidgetConfig()

  return (
    <ExpansionTransition in={open} width={chainExpansionWidth}>
      <SelectChainExpansionContainer
        expansionHeight={getWidgetMaxHeight(theme)}
      >
        <SelectChainContent inExpansion formType={formType} />
      </SelectChainExpansionContainer>
    </ExpansionTransition>
  )
})
