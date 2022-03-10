import { forwardRef, MutableRefObject, useState } from 'react';
import {
  Avatar,
  Box,
  DrawerProps,
  List,
  ListItemAvatar,
  ListItemText,
  Popover,
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
  WalletIdentityPopoverContent,
} from './SelectWalletDrawer.style';

export const SelectWalletDrawer = forwardRef<
  SelectWalletDrawerBase,
  DrawerProps
>((_, ref) => {
  const { ref: drawerRef } = useResizeDetector<HTMLDivElement | null>();
  const { connect } = useWalletInterface();
  const [showWalletIdentityModal, setShowWalletIdentityModal] = useState<{
    show: boolean;
    wallet?: Wallet;
    anchor?: Element;
  }>({ show: false });

  const closeDrawer = (ref as MutableRefObject<SelectWalletDrawerBase | null>)
    .current?.closeDrawer;

  const closeWalletPopover = () => {
    setShowWalletIdentityModal({
      show: false,
    });
  };

  const handleConnect = async (event: any, wallet: Wallet) => {
    const identityCheckPassed = wallet.checkProviderIdentity({
      provider: window.ethereum,
    });
    if (!identityCheckPassed) {
      setShowWalletIdentityModal({
        show: true,
        wallet,
        anchor: event.currentTarget,
      });
      return;
    }
    await connect(wallet);
    if (closeDrawer) {
      closeDrawer();
    }
  };

  const popoverId = showWalletIdentityModal?.show
    ? 'identity-popover'
    : undefined;

  return (
    <ContainerDrawer elementRef={drawerRef} ref={ref} route="selectWallet">
      <Box role="presentation">
        <List>
          {supportedWallets.map((wallet: Wallet) => {
            return (
              <WalletListItem
                key={wallet.name}
                onClick={(event) => handleConnect(event, wallet)}
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
      <Popover
        id={popoverId}
        open={showWalletIdentityModal!.show}
        anchorEl={showWalletIdentityModal!.anchor}
        onClose={closeWalletPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <WalletIdentityPopoverContent sx={{ p: 2 }}>
          Please make sure that only the {showWalletIdentityModal.wallet?.name}{' '}
          browser extension is active before choosing this wallet
        </WalletIdentityPopoverContent>
      </Popover>
    </ContainerDrawer>
  );
});
