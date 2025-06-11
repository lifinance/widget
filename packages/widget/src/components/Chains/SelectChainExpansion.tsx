import type { ExtendedChain } from '@lifi/sdk'
import { Collapse, Grow } from '@mui/material'
import { useCallback } from 'react'
import { animationTimeout } from '../../config/constants'
import type { FormType } from '../../stores/form/types'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { SelectChainContent } from './SelectChainContent'
import { SelectChainExpansionContainer } from './SelectChainExpansion.style'

interface SelectChainExpansionProps {
  formType: FormType
}

export const SelectChainExpansion = ({
  formType,
}: SelectChainExpansionProps) => {
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
            <SelectChainContent
              inExpansion
              formType={formType}
              onSelect={onSelect}
            />
          </SelectChainExpansionContainer>
        </div>
      </Grow>
    </Collapse>
  )
}
