import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import type { Theme } from '@mui/material'
import { Box, Tooltip } from '@mui/material'
import type { JSX, PropsWithChildren } from 'react'
import { ExternalWalletProvider } from '../../providers/ExternalWalletProvider/ExternalWalletProvider.js'
import { useDrawerToolValues } from '../../store/editTools/useDrawerToolValues.js'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useHeaderAndFooterToolValues } from '../../store/editTools/useHeaderAndFooterToolValues.js'
import {
  useConfigContainer,
  useConfigVariant,
} from '../../store/widgetConfig/useConfigValues.js'
import { useWidgetConfigStore } from '../../store/widgetConfig/WidgetConfigProvider.js'
import { isFullHeightLayout } from '../../utils/layout.js'
import { MockElement } from '../Mock/MockElement.js'
import { ToggleDrawerButton } from './ToggleDrawerButton.js'
import {
  DrawerOpenButton,
  FloatingToolsContainer,
  Main,
  WidgetContainer,
  WidgetContainerRow,
} from './WidgetView.style.js'

interface WidgetViewContainerProps extends PropsWithChildren {
  toggleDrawer?(): void
}

export function WidgetViewContainer({
  children,
  toggleDrawer,
}: WidgetViewContainerProps): JSX.Element {
  const { container } = useConfigContainer()
  const { variant } = useConfigVariant()
  const walletConfig = useWidgetConfigStore((s) => s.config?.walletConfig)
  const { isDrawerOpen, drawerWidth } = useDrawerToolValues()
  const { setDrawerOpen } = useEditToolsActions()
  const { showMockHeader, showMockFooter, isFooterFixed } =
    useHeaderAndFooterToolValues()

  const isWalletManagementExternal = !!walletConfig
  const isFullHeight = isFullHeightLayout(container)

  const showHeader = isFullHeight && showMockHeader
  const showFooter = isFullHeight && showMockFooter

  const mockElementSx = {
    position: 'fixed' as const,
    zIndex: 1,
    left: 0,
    paddingLeft: isDrawerOpen ? `${drawerWidth}px` : 0,
    transition: (theme: Theme) =>
      theme.transitions.create('padding-left', {
        duration: theme.transitions.duration.enteringScreen,
        easing: theme.transitions.easing.sharp,
      }),
  }

  return (
    <Main>
      <ExternalWalletProvider isExternalProvider={isWalletManagementExternal}>
        <FloatingToolsContainer
          drawerOpen={isDrawerOpen}
          drawerWidth={drawerWidth}
        >
          {!isDrawerOpen ? (
            <Tooltip title="Open tools" arrow>
              <DrawerOpenButton onClick={() => setDrawerOpen(true)}>
                <MenuOpenIcon />
              </DrawerOpenButton>
            </Tooltip>
          ) : null}
          {isWalletManagementExternal ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <appkit-button />
            </Box>
          ) : null}
          {variant === 'drawer' ? (
            <ToggleDrawerButton onClick={toggleDrawer} />
          ) : null}
        </FloatingToolsContainer>
        <WidgetContainer
          removePaddingTop={isFullHeight && !showHeader}
          alignTop={isFullHeight}
          sx={{
            marginLeft: isDrawerOpen ? `${drawerWidth}px` : 0,
            transition: (theme) =>
              theme.transitions.create('margin-left', {
                duration: theme.transitions.duration.enteringScreen,
                easing: theme.transitions.easing.sharp,
              }),
          }}
        >
          {showHeader ? (
            <MockElement sx={{ ...mockElementSx, top: 0 }}>
              Mock header
            </MockElement>
          ) : null}
          <WidgetContainerRow
            sx={{ marginBottom: !isFullHeight || showFooter ? 6 : 0 }}
          >
            {children}
          </WidgetContainerRow>
          {showFooter ? (
            <MockElement
              sx={isFooterFixed ? { ...mockElementSx, bottom: 0 } : undefined}
            >
              Mock footer
            </MockElement>
          ) : null}
        </WidgetContainer>
      </ExternalWalletProvider>
    </Main>
  )
}
