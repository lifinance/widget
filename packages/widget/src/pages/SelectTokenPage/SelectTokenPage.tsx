import { Box, type Theme, useMediaQuery } from '@mui/material'
import type { FC } from 'react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ChainSelect } from '../../components/ChainSelect/ChainSelect'
import { FullPageContainer } from '../../components/FullPageContainer'
import { TokenList } from '../../components/TokenList/TokenList'
import { useHeader } from '../../hooks/useHeader'
import { useScrollableOverflowHidden } from '../../hooks/useScrollableContainer'
import { useSwapOnly } from '../../hooks/useSwapOnly'
import { useWideVariant } from '../../hooks/useWideVariant'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import type { FormTypeProps } from '../../stores/form/types'
import { HiddenUI } from '../../types/widget'
import { SearchTokenInput } from './SearchTokenInput'

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
      <TokenList
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
