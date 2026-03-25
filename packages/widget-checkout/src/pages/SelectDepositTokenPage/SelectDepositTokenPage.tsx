import {
  ChainSelect,
  FullPageContainer,
  HiddenUI,
  SearchTokenInput,
  useHeader,
  useScrollableOverflowHidden,
  useWidgetConfig,
} from '@lifi/widget'
import { Box, type Theme, useMediaQuery } from '@mui/material'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutNavigate } from '../../hooks/useCheckoutNavigate.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import { SelectDepositTokenList } from './SelectDepositTokenList.js'

export const SelectDepositTokenPage: React.FC = () => {
  useScrollableOverflowHidden()

  const headerRef = useRef<HTMLElement>(null)
  const navigate = useCheckoutNavigate()
  const { t } = useTranslation()
  const { subvariant, hiddenUI } = useWidgetConfig()
  const formType = 'from' as const

  const title = subvariant === 'custom' ? t('header.payWith') : t('header.from')

  useHeader(title)

  const hideChainSelect = hiddenUI?.includes(HiddenUI.ChainSelect)

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(theme.breakpoints.values.xs)
  )
  const hideSearchTokenInput = hiddenUI?.includes(HiddenUI.SearchTokenInput)

  const hasHeader = !hideChainSelect || !hideSearchTokenInput

  const afterTokenSelect = () => {
    navigate({ to: checkoutNavigationRoutes.enterAmount })
  }

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
      <SelectDepositTokenList
        key={
          hideChainSelect
            ? 'without-offset'
            : isMobile
              ? 'with-offset-mobile'
              : 'with-offset'
        }
        headerRef={headerRef}
        formType={formType}
        afterTokenSelect={afterTokenSelect}
      />
    </FullPageContainer>
  )
}
