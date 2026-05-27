import type { ExtendedChain } from '@lifi/sdk'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useChainSelect } from '../../components/ChainSelect/useChainSelect.js'
import { SelectChainPageContent } from '../../components/Chains/SelectChainPageContent.js'
import { useTokenSelect } from '../../components/TokenList/useTokenSelect.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import type { SelectChainPageProps } from './types.js'

export const SelectChainPage: React.FC<SelectChainPageProps> = ({
  formType,
  selectNativeToken,
}) => {
  const navigateBack = useNavigateBack()
  const { setCurrentChain } = useChainSelect(formType)
  const selectToken = useTokenSelect(formType, navigateBack)

  const { t } = useTranslation()

  useHeader(t('header.selectChain'))

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

  return <SelectChainPageContent formType={formType} onSelect={handleClick} />
}
