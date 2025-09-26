import { Box, type Theme, useMediaQuery } from '@mui/material'
import type { FC, RefObject } from 'react'
import { useRef } from 'react'
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
  const title =
    formType === 'from'
      ? subvariant === 'custom'
        ? t('header.payWith')
        : t('header.from')
      : t('header.to')

  useHeader(title)

  const hideChainSelect =
    (wideVariant && subvariantOptions?.wide?.enableChainSidebar) ||
    (swapOnly && formType === 'to') ||
    hiddenUI?.includes(HiddenUI.ChainSelect)

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(theme.breakpoints.values.xs)
  )
  const hideSearchTokenInput = hiddenUI?.includes(HiddenUI.SearchTokenInput)

  const hasHeader = !hideChainSelect || !hideSearchTokenInput

  return (
    <FullPageContainer disableGutters>
      <Box
        ref={headerRef}
        sx={{
          pb: hasHeader ? 2 : 0,
          px: 3,
        }}
      >
        {!hideChainSelect ? <ChainSelect formType={formType} /> : null}
        {!hideSearchTokenInput && (
          <Box
            sx={{
              mt: !hideChainSelect ? 2 : 0,
            }}
          >
            <SearchTokenInput formType={formType} />
          </Box>
        )}
      </Box>
      <WrappedTokenList
        // Rerender component if variant changes (since chains tiles change height)
        key={
          hideChainSelect
            ? 'without-offset'
            : isMobile
              ? 'with-offset-mobile'
              : 'with-offset'
        }
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
  const { listHeight } = useListHeight({
    listParentRef,
    headerRef,
  })
  return (
    <TokenList
      parentRef={listParentRef}
      height={listHeight}
      onClick={navigateBack}
      formType={formType}
    />
  )
}
