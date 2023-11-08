import { isWalletInstalledAsync } from '@lifi/wallet-management';
import type { Theme } from '@mui/material';
import {
  Avatar,
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  List,
  ListItemAvatar,
  useMediaQuery,
} from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Connector } from 'wagmi';
import { useConnect } from 'wagmi';
import { Dialog } from '../../components/Dialog';
import { ListItemButton } from '../../components/ListItemButton';
import { ListItemText } from '../../components/ListItemText';
import { useNavigateBack } from '../../hooks';

export const SelectWalletPage = () => {
  const { t } = useTranslation();
  const { navigateBack } = useNavigateBack();
  const { connect, connectors } = useConnect();
  const [walletIdentity, setWalletIdentity] = useState<{
    show: boolean;
    connector?: Connector;
  }>({ show: false });
  const [wallets, setWallets] = useState<Connector[]>();
  const {
    wallets: solanaWallets,
    wallet: solanaWallet,
    select,
    connect: solanaConnect,
  } = useWallet();

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
    async (connector: Connector) => {
      const identityCheckPassed = await isWalletInstalledAsync(connector.id);
      if (!identityCheckPassed) {
        setWalletIdentity({
          show: true,
          connector,
        });
        return;
      }
      connect({ connector });
      navigateBack();
    },
    [connect, navigateBack],
  );

  useEffect(() => {
    Promise.all(
      connectors.map((connector) => isWalletInstalledAsync(connector.id)),
    ).then((installed) => {
      // separate into installed and not installed wallets
      const installedWallets = connectors.filter(
        (_, index) => installed[index],
      );
      // always remove Default Wallet from not installed Wallets
      const notInstalledWallets = connectors.filter(
        (connector, index) =>
          !installed[index] && connector.name !== 'Default Wallet',
      );

      const allowedWallets = [...installedWallets];

      if (isDesktopView) {
        allowedWallets.push(...notInstalledWallets);
      }

      setWallets(allowedWallets);
    });
  }, [connectors, isDesktopView]);

  return (
    <Container disableGutters>
      <List
        sx={{
          paddingLeft: 1.5,
          paddingRight: 1.5,
        }}
      >
        {wallets?.map((connector) => (
          <ListItemButton
            key={connector.uid}
            onClick={() => handleConnect(connector)}
          >
            <ListItemAvatar>
              <Avatar src={connector.icon} alt={connector.name}>
                {connector.name[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={connector.name} />
          </ListItemButton>
        ))}
        {solanaWallets?.map((wallet) => (
          <ListItemButton
            key={wallet.adapter.name}
            onClick={() => {
              select(wallet.adapter.name);
              solanaConnect();
            }}
          >
            <ListItemAvatar>
              <Avatar src={wallet.adapter.icon} alt={wallet.adapter.name}>
                {wallet.adapter.name[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={wallet.adapter.name}
              secondary={`${wallet.readyState} ${wallet.adapter.readyState} ${solanaWallet?.adapter.publicKey}`}
            />
          </ListItemButton>
        ))}
      </List>
      <Dialog open={walletIdentity.show} onClose={closeDialog}>
        <DialogContent>
          <DialogContentText>
            {t('wallet.extensionNotFound', {
              name: walletIdentity.connector?.name,
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
