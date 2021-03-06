import { supportedWallets, Wallet } from '@lifi/wallet-management';
import {
  Avatar,
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  List,
  ListItemAvatar,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '../../components/Dialog';
import { useWallet } from '../../providers/WalletProvider';
import {
  WalletListItemButton,
  WalletListItemText,
} from './SelectWalletPage.style';

export const SelectWalletPage = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { connect } = useWallet();
  const [walletIdentity, setWalletIdentity] = useState<{
    show: boolean;
    wallet?: Wallet;
  }>({ show: false });

  const closeDialog = () => {
    setWalletIdentity((state) => ({
      ...state,
      show: false,
    }));
  };

  const handleConnect = useCallback(
    async (event: any, wallet: Wallet) => {
      const { ethereum } = window as any;
      const identityCheckPassed = wallet.checkProviderIdentity({
        provider: ethereum,
      });
      if (!identityCheckPassed) {
        setWalletIdentity({
          show: true,
          wallet,
        });
        return;
      }
      navigate(-1);
      await connect(wallet);
    },
    [connect, navigate],
  );

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
            <WalletListItemText primary={wallet.name} />
          </WalletListItemButton>
        ))}
      </List>
      <Dialog open={walletIdentity.show} onClose={closeDialog}>
        <DialogContent>
          <DialogContentText>
            {t('wallet.extensionNotFound', {
              name: walletIdentity.wallet?.name,
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} autoFocus>
            {t('button.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
