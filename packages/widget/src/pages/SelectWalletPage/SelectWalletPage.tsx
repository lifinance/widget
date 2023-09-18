import type { Wallet } from '@lifi/wallet-management';
import { supportedWallets } from '@lifi/wallet-management';
import {
  Avatar,
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  List,
  ListItemAvatar,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../../components/Dialog';
import { ListItemButton } from '../../components/ListItemButton';
import { ListItemText } from '../../components/ListItemText';
import { useNavigateBack } from '../../hooks';
import { useWallet } from '../../providers';

export const SelectWalletPage = () => {
  const { t } = useTranslation();
  const { navigateBack } = useNavigateBack();
  const { connect } = useWallet();
  const [walletIdentity, setWalletIdentity] = useState<{
    show: boolean;
    wallet?: Wallet;
  }>({ show: false });
  const [wallets, setWallets] = useState<Wallet[]>();

  const isDesktopView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm'),
  );

  const closeDialog = () => {
    setWalletIdentity((state) => ({
      ...state,
      show: false,
    }));
  };

  const handleConnect = useCallback(
    async (wallet: Wallet) => {
      const identityCheckPassed = await wallet.installed();
      if (!identityCheckPassed) {
        setWalletIdentity({
          show: true,
          wallet,
        });
        return;
      }
      navigateBack();
      await connect(wallet);
    },
    [connect, navigateBack],
  );

  useEffect(() => {
    Promise.all(supportedWallets.map((wallet) => wallet.installed())).then(
      (installed) => {
        // separate into installed and not installed wallets
        const installedWallets = supportedWallets.filter(
          (_, index) => installed[index],
        );
        // always remove Default Wallet from not installed Wallets
        const notInstalledWallets = supportedWallets.filter(
          (wallet, index) =>
            !installed[index] && wallet.name !== 'Default Wallet',
        );

        const allowedWallets = [...installedWallets];

        if (isDesktopView) {
          allowedWallets.push(...notInstalledWallets);
        }

        setWallets(allowedWallets);
      },
    );
  }, []);

  return (
    <Container disableGutters>
      <List
        sx={{
          paddingLeft: 1.5,
          paddingRight: 1.5,
        }}
      >
        {wallets?.map((wallet: Wallet) => (
          <ListItemButton
            key={wallet.name}
            onClick={() => handleConnect(wallet)}
          >
            <ListItemAvatar>
              <Avatar
                src={(wallet.icon as any).src || wallet.icon}
                alt={wallet.name}
              >
                {wallet.name[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={wallet.name} />
          </ListItemButton>
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
          <Button variant="contained" onClick={closeDialog} autoFocus>
            {t('button.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
