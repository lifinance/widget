import {
  Avatar,
  Box,
  DrawerProps,
  List,
  ListItemAvatar,
  ListItemText,
  Popover,
} from '@mui/material';
import {
  forwardRef,
  MutableRefObject,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { useWalletInterface } from '../../hooks';
import {
  supportedWallets,
  Wallet,
} from '../../services/LiFiWalletManagement/wallets';
import { ContainerDrawer } from '../ContainerDrawer';
import {
  WalletIdentityPopoverContent,
  WalletListItem,
  WalletListItemButton,
} from './SelectWalletDrawer.style';
import { SelectWalletDrawerBase } from './types';

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

  const handleConnect = useCallback(
    async (event: any, wallet: Wallet) => {
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
      closeDrawer?.();
      await connect(wallet);
    },
    [closeDrawer, connect],
  );

  const popoverId = showWalletIdentityModal?.show
    ? 'identity-popover'
    : undefined;

  const wallets = useMemo(
    () =>
      supportedWallets.map((wallet: Wallet) => {
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
      }),
    [handleConnect],
  );

  return (
    <ContainerDrawer elementRef={drawerRef} ref={ref} route="selectWallet">
      <Box role="presentation">
        <List>{wallets}</List>
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
          {`Please make sure that only the ${showWalletIdentityModal.wallet?.name}
          browser extension is active before choosing this wallet.`}
        </WalletIdentityPopoverContent>
      </Popover>
    </ContainerDrawer>
  );
});
