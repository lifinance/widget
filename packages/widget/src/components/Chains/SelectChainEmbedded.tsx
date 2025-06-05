import type { ExtendedChain } from '@lifi/sdk'
import { useCallback } from 'react'
import { useMatch } from 'react-router-dom'
import type { FormType } from '../../stores/form/types'
import { navigationRoutes } from '../../utils/navigationRoutes'
import { AppContainer, FlexContainer } from '../AppContainer'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { Expansion } from '../Expansion/Expansion'
import { HeaderContainer } from '../Header/Header'
import { Initializer } from '../Initializer'
import { SelectChainContent } from './SelectChainContent'

interface SelectChainEmbeddedElementProps {
  formType: FormType
}

export const SelectChainEmbedded = () => {
  const isFromToken = useMatch(navigationRoutes.fromToken)
  const isToToken = useMatch(navigationRoutes.toToken)

  const formType = isFromToken ? 'from' : isToToken ? 'to' : null

  if (!formType) {
    return null
  }

  return <SelectChainEmbeddedElement formType={formType} />
}

export const SelectChainEmbeddedElement = ({
  formType,
}: SelectChainEmbeddedElementProps) => {
  const { setCurrentChain } = useChainSelect(formType)

  const onSelect = useCallback(
    (chain: ExtendedChain) => {
      setCurrentChain(chain.id)
    },
    [setCurrentChain]
  )

  return (
    <Expansion
      allowedPaths={[navigationRoutes.fromToken, navigationRoutes.toToken]}
    >
      <AppContainer>
        <HeaderContainer />
        <FlexContainer disableGutters>
          <SelectChainContent formType={formType} onSelect={onSelect} />
        </FlexContainer>
        <Initializer />
      </AppContainer>
    </Expansion>
  )
}
