import type { ExtendedChain } from '@lifi/sdk'
import { useLocation } from '@tanstack/react-router'
import { useCallback } from 'react'
import { useChainSelect } from '../../components/ChainSelect/useChainSelect.js'
import { SelectChainContent } from '../../components/Chains/SelectChainContent.js'
import { useTokenSelect } from '../../components/TokenList/useTokenSelect.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'

export const SelectChainPage = () => {
  const { pathname } = useLocation()
  const formType =
    pathname === navigationRoutes.fromTokenFromChain ? 'from' : 'to'
  const selectNativeToken = pathname === navigationRoutes.toTokenNative

  const navigateBack = useNavigateBack()
  const { setCurrentChain } = useChainSelect(formType)
  const selectToken = useTokenSelect(formType, navigateBack)

  const handleClick = useCallback(
    async (chain: ExtendedChain) => {
      if (selectNativeToken) {
        selectToken(chain.nativeToken.address, chain.id)
      } else {
        setCurrentChain(chain.id)
        navigateBack()
      }
    },
    [navigateBack, selectNativeToken, selectToken, setCurrentChain]
  )

  return (
    <SelectChainContent
      inExpansion={false}
      formType={formType}
      onSelect={handleClick}
    />
  )
}
