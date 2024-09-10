import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Tooltip } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { PropsWithChildren } from 'react';
import { ExternalWalletProvider } from '../../providers';
import {
  type Layout,
  useConfig,
  useDrawerToolValues,
  useEditToolsActions,
  useHeaderAndFooterToolValues,
  useLayoutValues,
} from '../../store';
import { MockElement } from '../Mock';
import { ToggleDrawerButton } from './ToggleDrawerButton';
import {
  DrawerOpenButton,
  FloatingToolsContainer,
  Main,
  WidgetContainer,
  WidgetContainerRow,
} from './WidgetView.style';

interface WidgetViewContainerProps extends PropsWithChildren {
  toggleDrawer?(): void;
}

const topAlignedLayouts: Layout[] = ['default', 'restricted-max-height'];

export function WidgetViewContainer({
  children,
  toggleDrawer,
}: WidgetViewContainerProps) {
  const { config } = useConfig();
  const { isDrawerOpen, drawerWidth } = useDrawerToolValues();
  const { selectedLayoutId } = useLayoutValues();
  const { setDrawerOpen } = useEditToolsActions();
  const { showMockHeader, showMockFooter, isFooterFixed } =
    useHeaderAndFooterToolValues();

  const isWalletManagementExternal = !!config?.walletConfig;

  const isFullHeightLayout =
    config?.theme?.container?.height === '100%' &&
    config?.theme?.container?.display === 'flex';

  const showHeader = isFullHeightLayout && showMockHeader;
  const showFooter = isFullHeightLayout && showMockFooter;

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
            <ConnectButton chainStatus="none" showBalance={false} />
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
              isFullHeightLayout && isFooterFixed
                ? { marginBottom: 6 }
                : undefined
            }
            alignTop={
              config?.theme?.container?.display === 'flex' ||
              topAlignedLayouts.includes(selectedLayoutId)
            }
            widgetContainer={config?.theme?.container}
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
  );
}
