import type { ExtendedChain } from '@lifi/sdk'
import { useCallback } from 'react'
import { useExpansionRoutes } from '../../hooks/useExpansionRoutes'
import { useHasChainExpansion } from '../../hooks/useHasChainExpansion'
import { ExpansionType } from '../../types/widget'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { SelectChainContent } from '../Chains/SelectChainContent'
import { SelectChainExpansionContainer } from './Expansion.style'
import { ExpansionSlide } from './ExpansionSlide'

export const ChainsExpansion = () => {
  const expansionType = useExpansionRoutes()
  const withChainExpansion = useHasChainExpansion()

  const formType = expansionType === ExpansionType.FromChain ? 'from' : 'to'

  const { setCurrentChain } = useChainSelect(formType)
  const onSelect = useCallback(
    (chain: ExtendedChain) => {
      setCurrentChain(chain.id)
    },
    [setCurrentChain]
  )

  if (!withChainExpansion) {
    return null
  }

  return (
    <ExpansionSlide open={withChainExpansion}>
      <SelectChainExpansionContainer>
        <SelectChainContent
          inExpansion
          formType={formType}
          onSelect={onSelect}
        />
      </SelectChainExpansionContainer>
    </ExpansionSlide>
  )
}
