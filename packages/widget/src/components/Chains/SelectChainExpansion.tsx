import type { ExtendedChain } from '@lifi/sdk'
import { Collapse, Grow } from '@mui/material'
import { useCallback } from 'react'
import { animationTimeout } from '../../config/constants'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import type { FormType } from '../../stores/form/types'
import { ElementId, createElementId } from '../../utils/elements'
import { CssBaselineContainer } from '../AppContainer'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { SelectChainContent } from './SelectChainContent'
import { SelectChainExpansionContainer } from './SelectChainExpansion.style'

interface SelectChainExpansionProps {
  formType: FormType
}

export const SelectChainExpansion = ({
  formType,
}: SelectChainExpansionProps) => {
  const { variant, elementId } = useWidgetConfig()

  const { setCurrentChain } = useChainSelect(formType)

  const onSelect = useCallback(
    (chain: ExtendedChain) => {
      setCurrentChain(chain.id)
    },
    [setCurrentChain]
  )

  return (
    <Collapse
      timeout={animationTimeout.enter}
      in
      orientation="horizontal"
      sx={(theme) => ({
        ...(theme.container?.display === 'flex' ? { height: '100%' } : {}),
      })}
    >
      <Grow timeout={animationTimeout.enter} in mountOnEnter unmountOnExit>
        <div>
          <SelectChainExpansionContainer>
            <CssBaselineContainer
              id={createElementId(ElementId.ScrollableContainer, elementId)}
              variant={variant}
              enableColorScheme
              paddingTopAdjustment={0}
              elementId={elementId}
            >
              <SelectChainContent
                inExpansion
                formType={formType}
                onSelect={onSelect}
              />
            </CssBaselineContainer>
          </SelectChainExpansionContainer>
        </div>
      </Grow>
    </Collapse>
  )
}
