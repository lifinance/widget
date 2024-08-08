import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  List,
} from '@mui/material';
import type { Wallet } from '@solana/wallet-adapter-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Connector } from 'wagmi';
import { useAccount as useWagmiAccount } from 'wagmi';
import { Dialog } from '../../components/Dialog.js';
import { PageContainer } from '../../components/PageContainer.js';
import { useHeader } from '../../hooks/useHeader.js';
import { useWallets } from '../../hooks/useWallets.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { EVMListItemButton } from './EVMListItemButton.js';
import { SVMListItemButton } from './SVMListItemButton.js';

export const SelectWalletPage = () => {
  const { t } = useTranslation();
  const { chains, walletConfig } = useWidgetConfig();
  const account = useWagmiAccount();
  const [walletIdentity, setWalletIdentity] = useState<{
    show: boolean;
    connector?: Connector;
  }>({ show: false });

  useHeader(t(`header.selectWallet`));

  const closeDialog = () => {
    setWalletIdentity((state) => ({
      ...state,
      show: false,
    }));
  };

  const handleNotInstalled = useCallback(async (connector: Connector) => {
    setWalletIdentity({
      show: true,
      connector,
    });
  }, []);

  const wallets = useWallets(walletConfig, chains);

  return (
    <PageContainer disableGutters>
      {wallets.map((wallet: any) => (
        <Box>{wallet?.id}</Box>
      ))}
      <List
        sx={{
          paddingTop: 0,
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingBottom: 1.5,
        }}
      >
        {wallets?.map((connector) =>
          (connector as Connector).id ? (
            <EVMListItemButton
              key={(connector as Connector).id}
              connector={connector as Connector}
              connectedConnector={account.connector}
              onNotInstalled={handleNotInstalled}
            />
          ) : (
            <SVMListItemButton
              key={(connector as Wallet).adapter.name}
              wallet={connector as Wallet}
            />
          ),
        )}
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
    </PageContainer>
  );
};
