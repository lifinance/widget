import { ChainType } from '@lifi/sdk';
import { isWalletInstalled } from '@lifi/wallet-management';
import type { Theme } from '@mui/material';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  List,
  useMediaQuery,
} from '@mui/material';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import type { Wallet } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Connector } from 'wagmi';
import { useConnect, useAccount as useWagmiAccount } from 'wagmi';
import { Dialog } from '../../components/Dialog.js';
import { PageContainer } from '../../components/PageContainer.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { isItemAllowed } from '../../utils/item.js';
import { EVMListItemButton } from './EVMListItemButton.js';
import { SVMListItemButton } from './SVMListItemButton.js';
import { walletComparator } from './utils.js';

export const SelectWalletPage = () => {
  const { t } = useTranslation();
  const { chains } = useWidgetConfig();
  const account = useWagmiAccount();
  const { connectors } = useConnect();
  const [walletIdentity, setWalletIdentity] = useState<{
    show: boolean;
    connector?: Connector;
  }>({ show: false });
  const { wallets: solanaWallets } = useWallet();

  const isDesktopView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm'),
  );

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

  const wallets = useMemo(() => {
    const evmInstalled = isItemAllowed(ChainType.EVM, chains?.types)
      ? connectors.filter(
          (connector) =>
            isWalletInstalled(connector.id) &&
            // We should not show already connected connectors
            account.connector?.id !== connector.id,
        )
      : [];
    const evmNotDetected = isItemAllowed(ChainType.EVM, chains?.types)
      ? connectors.filter((connector) => !isWalletInstalled(connector.id))
      : [];
    const svmInstalled = isItemAllowed(ChainType.SVM, chains?.types)
      ? solanaWallets?.filter(
          (connector) =>
            connector.adapter.readyState === WalletReadyState.Installed &&
            // We should not show already connected connectors
            !connector.adapter.connected,
        )
      : [];
    const svmNotDetected = isItemAllowed(ChainType.SVM, chains?.types)
      ? solanaWallets?.filter(
          (connector) =>
            connector.adapter.readyState !== WalletReadyState.Installed,
        )
      : [];

    const installedWallets = [...evmInstalled, ...svmInstalled].sort(
      walletComparator,
    );

    if (isDesktopView) {
      const notDetectedWallets = [...evmNotDetected, ...svmNotDetected].sort(
        walletComparator,
      );
      installedWallets.push(...notDetectedWallets);
    }

    return installedWallets;
  }, [
    account.connector?.id,
    chains?.types,
    connectors,
    isDesktopView,
    solanaWallets,
  ]);

  return (
    <PageContainer disableGutters>
      <List
        sx={{
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingBottom: 1.5,
        }}
      >
        {wallets?.map((connector) =>
          (connector as Connector).uid ? (
            <EVMListItemButton
              key={(connector as Connector).uid}
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
