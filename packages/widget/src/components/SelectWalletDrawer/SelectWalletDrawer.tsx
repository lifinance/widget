import { forwardRef, MutableRefObject } from 'react';
import {
  Avatar,
  Box,
  DrawerProps,
  List,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { useResizeDetector } from 'react-resize-detector';
import {
  supportedWalletInfos,
  SupportedWalletProviders,
} from '@lifinance/widget/services/LiFiWalletManagement/LiFiWalletManagement';
import { useWalletInterface } from '@lifinance/widget/services/walletInterface';
import { SelectWalletDrawerBase } from './types';
import { ContainerDrawer } from '../ContainerDrawer';
import {
  WalletListItem,
  WalletListItemButton,
} from './SelectWalletDrawer.style';

export const SelectWalletDrawer = forwardRef<
  SelectWalletDrawerBase,
  DrawerProps
>((_, ref) => {
  const { ref: drawerRef } = useResizeDetector<HTMLDivElement | null>();
  const { connect } = useWalletInterface();

  const closeDrawer = (ref as MutableRefObject<SelectWalletDrawerBase | null>)
    .current?.closeDrawer;

  const handleConnect = async (walletProvider: SupportedWalletProviders) => {
    await connect(walletProvider);
    if (closeDrawer) {
      closeDrawer();
    }
  };

  return (
    <ContainerDrawer elementRef={drawerRef} ref={ref} route="selectWallet">
      <Box role="presentation">
        <List>
          {Object.entries(supportedWalletInfos).map((walletInfo) => {
            return (
              <WalletListItem
                key={walletInfo[0]}
                onClick={() =>
                  handleConnect(
                    walletInfo[0] as unknown as SupportedWalletProviders,
                  )
                }
              >
                <WalletListItemButton>
                  <ListItemAvatar>
                    <Avatar src={walletInfo[1].icon} alt={walletInfo[1].name} />
                  </ListItemAvatar>
                  <ListItemText primary={walletInfo[1].name} />
                </WalletListItemButton>
              </WalletListItem>
            );
          })}
        </List>
      </Box>
    </ContainerDrawer>
  );
});
