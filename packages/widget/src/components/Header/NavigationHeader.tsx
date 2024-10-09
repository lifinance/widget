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
import { SplitWalletMenuButton } from './WalletHeader.js'

export const NavigationHeader: React.FC = () => {
  const { subvariant, hiddenUI, variant } = useWidgetConfig()
  const { navigateBack } = useNavigateBack()
  const { account } = useAccount()
  const { element, title } = useHeaderStore((state) => state)
  const { pathname } = useLocation()

  const cleanedPathname = pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname
  const path = cleanedPathname.substring(cleanedPathname.lastIndexOf('/') + 1)
  const hasPath = navigationRoutesValues.includes(path)

  const splitSubvariant = subvariant === 'split' && !hasPath

  return (
    <>
      <HeaderAppBar elevation={0}>
        {backButtonRoutes.includes(path) ? (
          <BackButton onClick={navigateBack} />
        ) : null}
        {splitSubvariant ? (
          <Box flex={1}>
            <SplitWalletMenuButton />
          </Box>
        ) : (
          <Typography
            fontSize={hasPath ? 18 : 24}
            align={hasPath ? 'center' : 'left'}
            fontWeight="700"
            flex={1}
            noWrap
          >
            {title}
          </Typography>
        )}
        <Routes>
          <Route
            path={navigationRoutes.home}
            element={
              <HeaderControlsContainer>
                {account.isConnected &&
                !hiddenUI?.includes(HiddenUI.History) ? (
                  <TransactionHistoryButton />
                ) : null}
                <SettingsButton />
                {variant === 'drawer' &&
                !hiddenUI?.includes(HiddenUI.DrawerCloseButton) ? (
                  <CloseDrawerButton header="navigation" />
                ) : null}
              </HeaderControlsContainer>
            }
          />
          <Route path="*" element={element || <Box width={28} height={40} />} />
        </Routes>
      </HeaderAppBar>
      {splitSubvariant ? <NavigationTabs /> : null}
    </>
  )
}
