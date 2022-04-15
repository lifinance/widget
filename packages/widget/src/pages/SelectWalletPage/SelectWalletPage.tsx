import { supportedWallets, Wallet } from '@lifinance/wallet-management';
import {
  Avatar,
  Container,
  List,
  ListItemAvatar,
  ListItemText,
  Popover,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../providers/WalletProvider';
import {
  WalletIdentityPopoverContent,
  WalletListItem,
  WalletListItemButton,
} from './SelectWalletPage.style';

export const SelectWalletPage = () => {
  const navigate = useNavigate();
  const { connect } = useWallet();
  const [showWalletIdentityModal, setShowWalletIdentityModal] = useState<{
    show: boolean;
    wallet?: Wallet;
    anchor?: Element;
  }>({ show: false });

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
      navigate(-1);
      await connect(wallet);
    },
    [connect, navigate],
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
    <Container disableGutters>
      <List sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {wallets}
      </List>
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
    </Container>
  );
};
