import { Box, type Theme, useMediaQuery } from '@mui/material'
import { Outlet, useLocation } from '@tanstack/react-router'
import type { FC } from 'react'
import { useRef } from 'react'
import { ChainSelect } from '../../components/ChainSelect/ChainSelect.js'
import { FullPageContainer } from '../../components/FullPageContainer.js'
import { TokenList } from '../../components/TokenList/TokenList.js'
import { useScrollableOverflowHidden } from '../../hooks/useScrollableContainer.js'
import { useSwapOnly } from '../../hooks/useSwapOnly.js'
import { useWideVariant } from '../../hooks/useWideVariant.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { HiddenUI } from '../../types/widget.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { SearchTokenInput } from './SearchTokenInput.js'

export const SelectTokenPage = () => {
  const { pathname } = useLocation()

  if (pathname === navigationRoutes.fromToken) {
    return <SelectTokenPageComponent formType="from" />
  }

  if (pathname === navigationRoutes.toToken) {
    return <SelectTokenPageComponent formType="to" />
  }

  return <Outlet />
}

const SelectTokenPageComponent: FC<FormTypeProps> = ({ formType }) => {
  useScrollableOverflowHidden()

  const headerRef = useRef<HTMLElement>(null)

  const swapOnly = useSwapOnly()

  const { hiddenUI, subvariantOptions } = useWidgetConfig()
  const wideVariant = useWideVariant()

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
