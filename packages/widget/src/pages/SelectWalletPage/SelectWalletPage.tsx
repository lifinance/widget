import { supportedWallets, Wallet } from '@lifinance/wallet-management';
import {
  Avatar,
  Container,
  List,
  ListItemAvatar,
  ListItemText,
  Popover,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../providers/WalletProvider';
import {
  WalletIdentityPopoverContent,
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

  return (
    <Container disableGutters>
      <List
        sx={{
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        {supportedWallets.map((wallet: Wallet) => (
          <WalletListItemButton
            key={wallet.name}
            onClick={(event) => handleConnect(event, wallet)}
            disableRipple
          >
            <ListItemAvatar>
              <Avatar src={wallet.icon} alt={wallet.name}>
                {wallet.name[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={wallet.name} />
          </WalletListItemButton>
        ))}
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
