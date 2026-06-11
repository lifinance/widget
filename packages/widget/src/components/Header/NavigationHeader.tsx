import { useAccount } from '@lifi/wallet-management'
import { Box, Typography } from '@mui/material'
import { useLocation } from '@tanstack/react-router'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useHeaderStore } from '../../stores/header/useHeaderStore.js'
import {
  backButtonRoutes,
  navigationRoutes,
  navigationRoutesValues,
} from '../../utils/navigationRoutes.js'
import { ActivitiesButton } from './ActivitiesButton.js'
import { BackButton } from './BackButton.js'
import { CloseDrawerButton } from './CloseDrawerButton.js'
import { HeaderAppBar, HeaderControlsContainer } from './Header.style.js'
import { HeaderNavigationTabs } from './HeaderNavigationTabs.js'
import { SettingsButton } from './SettingsButton.js'

export const NavigationHeader: React.FC = () => {
  const { mode, hiddenUI, variant, defaultUI, modeOptions } = useWidgetConfig()
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

  const isSplitWithTabs =
    mode === 'split' && typeof modeOptions?.split !== 'string'

  const isJumperMode = mode === 'jumper-simple' || mode === 'jumper-advanced'

  const showHeaderTabs = !hasPath && (isSplitWithTabs || isJumperMode)

  return (
    <HeaderAppBar elevation={0} sx={{ paddingTop: 1, paddingBottom: 0.5 }}>
      {backButtonRoutes.includes(path) ? <BackButton /> : null}
      {showHeaderTabs ? (
        <Box sx={{ flex: 1, marginRight: 1 }}>
          <HeaderNavigationTabs />
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
          {account.isConnected && !hiddenUI?.history && <ActivitiesButton />}
          <SettingsButton />
          {variant === 'drawer' && !hiddenUI?.drawerCloseButton ? (
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
