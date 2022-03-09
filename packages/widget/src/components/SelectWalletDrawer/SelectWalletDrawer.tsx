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
  supportedWallets,
  Wallet,
} from '@lifinance/widget/services/LiFiWalletManagement/wallets';
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

  const handleConnect = async (wallet: Wallet) => {
    await connect(wallet);
    if (closeDrawer) {
      closeDrawer();
    }
  };

  return (
    <ContainerDrawer elementRef={drawerRef} ref={ref} route="selectWallet">
      <Box role="presentation">
        <List>
          {supportedWallets.map((wallet: Wallet) => {
            return (
              <WalletListItem
                key={wallet.name}
                onClick={() => handleConnect(wallet)}
              >
                <WalletListItemButton>
                  <ListItemAvatar>
                    <Avatar src={wallet.icon} alt={wallet.name} />
                  </ListItemAvatar>
                  <ListItemText primary={wallet.name} />
                </WalletListItemButton>
              </WalletListItem>
            );
          })}
        </List>
      </Box>
    </ContainerDrawer>
  );
});
