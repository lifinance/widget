import { useAccount } from '@lifi/wallet-management'
import { Box, Typography } from '@mui/material'
import { useLocation, useNavigate } from '@tanstack/react-router'
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
import { SettingsButton } from './SettingsButton.js'
import { SplitNavigationTabs } from './SplitNavigationTabs.js'
import { TransactionHistoryButton } from './TransactionHistoryButton.js'

export const NavigationHeader: React.FC = () => {
  const { subvariant, hiddenUI, variant, defaultUI, subvariantOptions } =
    useWidgetConfig()
  const navigateBack = useNavigateBack()
  const navigate = useNavigate()
  const { account } = useAccount()
  const [element, title] = useHeaderStore((state) => [
    state.element,
    state.title,
  ])
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
        <BackButton
          onClick={() => {
            if (path.endsWith(navigationRoutes.transactionDetails)) {
              navigate({ to: navigationRoutes.home, replace: true })
            } else {
              navigateBack()
            }
          }}
        />
      ) : null}
      {showSplitOptions ? (
        <Box sx={{ flex: 1, marginRight: 1 }}>
          <SplitNavigationTabs />
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
      {pathname === navigationRoutes.home ? (
        <HeaderControlsContainer>
          {account.isConnected && !hiddenUI?.includes(HiddenUI.History) && (
            <TransactionHistoryButton />
          )}
          <SettingsButton />
          {variant === 'drawer' &&
          !hiddenUI?.includes(HiddenUI.DrawerCloseButton) ? (
            <CloseDrawerButton header="navigation" />
          ) : null}
        </HeaderControlsContainer>
      ) : (
        element || (
          <Box
            sx={{
              width: 28,
              height: 40,
            }}
          />
        )
      )}
    </HeaderAppBar>
  )
}
