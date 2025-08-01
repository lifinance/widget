import { useAccount } from '@lifi/wallet-management'
import { Box, Typography } from '@mui/material'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useHeaderStore } from '../../stores/header/useHeaderStore.js'
import { HiddenUI } from '../../types/widget.js'
import {
  backButtonRoutes,
  navigationRoutes,
  navigationRoutesValues,
} from '../../utils/navigationRoutes.js'
import { BackButton } from './BackButton.js'
import { CloseDrawerButton } from './CloseDrawerButton.js'
import { HeaderAppBar, HeaderControlsContainer } from './Header.style.js'
import { NavigationTabs } from './NavigationTabs.js'
import { SettingsButton } from './SettingsButton.js'
import { TransactionHistoryButton } from './TransactionHistoryButton.js'

export const NavigationHeader: React.FC = () => {
  const { subvariant, hiddenUI, variant, defaultUI, subvariantOptions } =
    useWidgetConfig()
  const { navigateBack } = useNavigateBack()
  const { account } = useAccount()
  const { element, title } = useHeaderStore((state) => state)
  const { pathname } = useLocation()

  const cleanedPathname = pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname
  const path = cleanedPathname.substring(cleanedPathname.lastIndexOf('/') + 1)
  const hasPath = navigationRoutesValues.includes(path)

  const showSplitOptions =
    subvariant === 'split' && !hasPath && !subvariantOptions?.split

  return (
    <HeaderAppBar elevation={0} sx={{ paddingTop: 1, paddingBottom: 0.5 }}>
      {backButtonRoutes.includes(path) ? (
        <BackButton onClick={navigateBack} />
      ) : null}
      {showSplitOptions ? (
        <Box sx={{ flex: 1, marginRight: 1 }}>
          <NavigationTabs />
        </Box>
      ) : (
        <Typography
          align={hasPath ? 'center' : 'left'}
          noWrap={defaultUI?.navigationHeaderTitleNoWrap ?? true}
          sx={{
            fontSize: hasPath ? 18 : 24,
            fontWeight: '700',
            flex: 1,
          }}
        >
          {title}
        </Typography>
      )}
      <Routes>
        <Route
          path={navigationRoutes.home}
          element={
            <HeaderControlsContainer>
              {!hiddenUI?.includes(HiddenUI.History) && (
                <TransactionHistoryButton hidden={!account.isConnected} />
              )}
              <SettingsButton />
              {variant === 'drawer' &&
              !hiddenUI?.includes(HiddenUI.DrawerCloseButton) ? (
                <CloseDrawerButton header="navigation" />
              ) : null}
            </HeaderControlsContainer>
          }
        />
        <Route
          path="*"
          element={
            element || (
              <Box
                sx={{
                  width: 28,
                  height: 40,
                }}
              />
            )
          }
        />
      </Routes>
    </HeaderAppBar>
  )
}
