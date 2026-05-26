import MenuOpenIcon from '@mui/icons-material/MenuOpen'
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
import {
  getDrawerOffset,
  getMockFooterSx,
  getMockHeaderSx,
  getWidgetContainerDrawerSx,
} from '../../utils/widgetViewDrawer.js'
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

  const drawerOffset = getDrawerOffset(isDrawerOpen, drawerWidth)

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
          sx={getWidgetContainerDrawerSx(drawerOffset)}
        >
          {showHeader ? (
            <MockElement sx={getMockHeaderSx(drawerOffset)}>
              Mock header
            </MockElement>
          ) : null}
          <WidgetContainerRow
            sx={{ marginBottom: !isFullHeight || showFooter ? 6 : 0 }}
          >
            {children}
          </WidgetContainerRow>
          {showFooter ? (
            <MockElement sx={getMockFooterSx(drawerOffset, isFooterFixed)}>
              Mock footer
            </MockElement>
          ) : null}
        </WidgetContainer>
      </ExternalWalletProvider>
    </Main>
  )
}
