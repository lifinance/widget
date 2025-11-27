import { memo } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import type { FormType } from '../../stores/form/types'
import { getWidgetMaxHeight } from '../../utils/widgetSize'
import { ExpansionTransition } from '../Expansion/ExpansionTransition'
import {
  chainExpansionWidth,
  SelectChainExpansionContainer,
} from './ChainsExpanded.style'
import { SelectChainContent } from './SelectChainContent'

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
