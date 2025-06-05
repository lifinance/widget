import type { ExtendedChain } from '@lifi/sdk'
import { Collapse, Grow } from '@mui/material'
import { useCallback } from 'react'
import { animationTimeout } from '../../config/constants'
import type { FormType } from '../../stores/form/types'
import { AppContainer, FlexContainer } from '../AppContainer'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { HeaderContainer } from '../Header/Header'
import { Initializer } from '../Initializer'
import { SelectChainContent } from './SelectChainContent'
interface SelectChainEmbeddedProps {
  formType: FormType
}

export const SelectChainEmbedded = ({ formType }: SelectChainEmbeddedProps) => {
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
          <AppContainer>
            <HeaderContainer />
            <FlexContainer disableGutters>
              <SelectChainContent formType={formType} onSelect={onSelect} />
            </FlexContainer>
            <Initializer />
          </AppContainer>
        </div>
      </Grow>
    </Collapse>
  )
}
