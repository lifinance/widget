import type React from 'react'
import { memo } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../../stores/form/types.js'
import { getWidgetMaxHeight } from '../../utils/widgetSize.js'
import { ExpansionTransition } from '../Expansion/ExpansionTransition.js'
import {
  chainExpansionWidth,
  SelectChainExpansionContainer,
} from './ChainsExpanded.style.js'
import { SelectChainExpansionContent } from './SelectChainExpansionContent.js'

interface ChainsExpandedProps {
  formType: FormType
  open: boolean
}

export const ChainsExpanded: React.NamedExoticComponent<ChainsExpandedProps> =
  memo(function ChainsExpanded({ formType, open }: ChainsExpandedProps) {
    const { theme } = useWidgetConfig()

    return (
      <ExpansionTransition in={open} width={chainExpansionWidth}>
        <SelectChainExpansionContainer
          expansionHeight={getWidgetMaxHeight(theme)}
        >
          <SelectChainExpansionContent formType={formType} />
        </SelectChainExpansionContainer>
      </ExpansionTransition>
    )
  })
