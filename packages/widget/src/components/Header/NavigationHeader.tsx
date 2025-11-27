import { useAccount } from '@lifi/wallet-management'
import { Box, Typography } from '@mui/material'
import { useLocation } from '@tanstack/react-router'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import { useHeaderStore } from '../../stores/header/useHeaderStore'
import { HiddenUI } from '../../types/widget'
import {
  backButtonRoutes,
  navigationRoutes,
  navigationRoutesValues,
} from '../../utils/navigationRoutes'
import { BackButton } from './BackButton'
import { CloseDrawerButton } from './CloseDrawerButton'
import { HeaderAppBar, HeaderControlsContainer } from './Header.style'
import { SettingsButton } from './SettingsButton'
import { SplitNavigationTabs } from './SplitNavigationTabs'
import { TransactionHistoryButton } from './TransactionHistoryButton'

export const NavigationHeader: React.FC = () => {
  const { subvariant, hiddenUI, variant, defaultUI, subvariantOptions } =
    useWidgetConfig()
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
      {backButtonRoutes.includes(path) ? <BackButton /> : null}
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
