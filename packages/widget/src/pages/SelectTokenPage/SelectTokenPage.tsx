import { Box } from '@mui/material'
import type { FC, RefObject } from 'react'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ChainSelect } from '../../components/ChainSelect/ChainSelect.js'
import { FullPageContainer } from '../../components/FullPageContainer.js'
import { TokenList } from '../../components/TokenList/TokenList.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useListHeight } from '../../hooks/useListHeight.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useScrollableOverflowHidden } from '../../hooks/useScrollableContainer.js'
import { useSwapOnly } from '../../hooks/useSwapOnly.js'
import { useWideVariant } from '../../hooks/useWideVariant.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import type { FormType, FormTypeProps } from '../../stores/form/types.js'
import { HiddenUI } from '../../types/widget.js'
import { SearchTokenInput } from './SearchTokenInput.js'

export const SelectTokenPage: FC<FormTypeProps> = ({ formType }) => {
  useScrollableOverflowHidden()

  const headerRef = useRef<HTMLElement>(null)

  const swapOnly = useSwapOnly()

  const { subvariant, hiddenUI, subvariantOptions } = useWidgetConfig()
  const wideVariant = useWideVariant()

  const { t } = useTranslation()
  const title = useMemo(() => {
    if (formType === 'from') {
      return subvariant === 'custom' ? t('header.payWith') : t('header.from')
    }
    return t('header.to')
  }, [formType, subvariant, t])

  useHeader(title)

  const hideChainSelect = useMemo(() => {
    return (
      (wideVariant && subvariantOptions?.wide?.enableChainSidebar) ||
      (swapOnly && formType === 'to') ||
      hiddenUI?.includes(HiddenUI.ChainSelect)
    )
  }, [wideVariant, subvariantOptions, swapOnly, formType, hiddenUI])

  return (
    <FullPageContainer disableGutters>
      <Box ref={headerRef} sx={{ pb: 2, px: 3 }}>
        {!hideChainSelect ? <ChainSelect formType={formType} /> : null}
        <Box sx={{ mt: !hideChainSelect ? 2 : 0 }}>
          <SearchTokenInput />
        </Box>
      </Box>
      <WrappedTokenList
        // Rerender component if variant changes (since chains tiles change height)
        key={hideChainSelect ? 'without-offset' : 'with-offset'}
        headerRef={headerRef}
        formType={formType}
      />
    </FullPageContainer>
  )
}

type WrappedTokenListProps = {
  headerRef: RefObject<HTMLElement | null>
  formType: FormType
}

const WrappedTokenList = ({ headerRef, formType }: WrappedTokenListProps) => {
  const { navigateBack } = useNavigateBack()
  const listParentRef = useRef<HTMLUListElement | null>(null)
  const { listHeight, minListHeight } = useListHeight({
    listParentRef,
    headerRef,
  })
  return (
    <Box
      sx={{
        height: minListHeight,
      }}
    >
      <TokenList
        parentRef={listParentRef}
        height={listHeight}
        onClick={navigateBack}
        formType={formType}
      />
    </Box>
  )
}
