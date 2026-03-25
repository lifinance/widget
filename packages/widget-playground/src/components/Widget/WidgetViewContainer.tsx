import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { Box, Tooltip } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { ExternalWalletProvider } from '../../providers/ExternalWalletProvider/ExternalWalletProvider.js'
import { useDrawerToolValues } from '../../store/editTools/useDrawerToolValues.js'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useHeaderAndFooterToolValues } from '../../store/editTools/useHeaderAndFooterToolValues.js'
import { useConfig } from '../../store/widgetConfig/useConfig.js'
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
}: WidgetViewContainerProps) {
  const { config } = useConfig()
  const { isDrawerOpen, drawerWidth } = useDrawerToolValues()
  const { setDrawerOpen } = useEditToolsActions()
  const { showMockHeader, showMockFooter, isFooterFixed } =
    useHeaderAndFooterToolValues()

  const isWalletManagementExternal = !!config?.walletConfig

  const isFullHeightLayout =
    config?.theme?.container?.height === '100%' &&
    config?.theme?.container?.display === 'flex'

  const showHeader = isFullHeightLayout && showMockHeader
  const showFooter = isFullHeightLayout && showMockFooter

  const isDefault =
    !config?.theme?.container?.height ||
    config?.theme?.container?.height === 'fit-content'

  return (
    <Main open={isDrawerOpen} drawerWidth={drawerWidth}>
      <ExternalWalletProvider isExternalProvider={isWalletManagementExternal}>
        <FloatingToolsContainer>
          {!isDrawerOpen ? (
            <Tooltip title="Open tools" arrow>
              <DrawerOpenButton onClick={() => setDrawerOpen(true)}>
                <MenuOpenIcon />
              </DrawerOpenButton>
            </Tooltip>
          ) : null}
          {isWalletManagementExternal ? (
            <Box display="flex" alignItems="center">
              <appkit-button />
            </Box>
          ) : null}
          {config?.variant === 'drawer' ? (
            <ToggleDrawerButton onClick={toggleDrawer} />
          ) : null}
        </FloatingToolsContainer>
        <WidgetContainer
          removePaddingTop={
            (config?.theme?.container?.height === '100%' && !showHeader) ||
            (config?.theme?.container?.display === 'flex' && !showHeader)
          }
          alignTop={config?.theme?.container?.display === 'flex'}
        >
          {showHeader ? (
            <MockElement sx={{ position: 'fixed', zIndex: 1, top: 0 }}>
              Mock header
            </MockElement>
          ) : null}
          <WidgetContainerRow
            sx={
              (isFullHeightLayout && isFooterFixed) || isDefault
                ? { marginBottom: 6 }
                : undefined
            }
          >
            {children}
          </WidgetContainerRow>
          {showFooter ? (
            <MockElement
              sx={
                isFullHeightLayout && isFooterFixed
                  ? { position: 'fixed', zIndex: 1, bottom: 0 }
                  : undefined
              }
            >
              Mock footer
            </MockElement>
          ) : null}
        </WidgetContainer>
      </ExternalWalletProvider>
    </Main>
  )
}
