import { ChainId, ChainType } from '@lifi/sdk';
import {
  isWalletInstalled,
  isWalletInstalledAsync,
} from '@lifi/wallet-management';
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
import { WalletReadyState } from '@solana/wallet-adapter-base';
import type { Wallet } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Connector } from 'wagmi';
import { useConnect } from 'wagmi';
import { Dialog } from '../../components/Dialog';
import { ListItemButton } from '../../components/ListItemButton';
import { ListItemText } from '../../components/ListItemText';
import { useNavigateBack, useWidgetEvents } from '../../hooks';
import { WidgetEvent } from '../../types';

export const SelectWalletPage = () => {
  const { t } = useTranslation();
  const { navigateBack } = useNavigateBack();
  const emitter = useWidgetEvents();
  const { connectAsync, connectors } = useConnect();
  const [walletIdentity, setWalletIdentity] = useState<{
    show: boolean;
    connector?: Connector;
  }>({ show: false });
  const [wallets, setWallets] = useState<(Connector | Wallet)[]>();
  const {
    wallets: solanaWallets,
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

  const handleEVMConnect = useCallback(
    async (connector: Connector) => {
      const identityCheckPassed = await isWalletInstalledAsync(connector.id);
      if (!identityCheckPassed) {
        setWalletIdentity({
          show: true,
          connector,
        });
        return;
      }
      await connectAsync(
        { connector },
        {
          onSuccess(data) {
            emitter.emit(WidgetEvent.WalletConnected, {
              address: data.accounts[0],
              chainId: data.chainId,
              chainType: ChainType.EVM,
            });
          },
        },
      );
      navigateBack();
    },
    [connectAsync, emitter, navigateBack],
  );

  const handleSVMConnect = useCallback(
    async (wallet: Wallet) => {
      select(wallet.adapter.name);
      // We use autoConnect on wallet selection
      // await solanaConnect();
      // TODO: Check if this works fine for Solana autoConnect
      emitter.emit(WidgetEvent.WalletConnected, {
        address: wallet.adapter.publicKey?.toString(),
        chainId: ChainId.SOL,
        chainType: ChainType.SVM,
      });
      navigateBack();
    },
    [emitter, navigateBack, select],
  );

  useEffect(() => {
    const evmInstalled = connectors.filter((connector) =>
      isWalletInstalled(connector.id),
    );
    const evmNotDetected = connectors.filter(
      (connector) => !isWalletInstalled(connector.id),
    );
    const svmInstalled = solanaWallets?.filter(
      (connector) =>
        connector.adapter.readyState === WalletReadyState.Installed,
    );
    const svmNotDetected = solanaWallets?.filter(
      (connector) =>
        connector.adapter.readyState !== WalletReadyState.Installed,
    );

    const installedWallets = [...evmInstalled, ...svmInstalled];

    if (isDesktopView) {
      installedWallets.push(...evmNotDetected, ...svmNotDetected);
    }

    setWallets(installedWallets);
  }, [connectors, isDesktopView, solanaWallets]);

  const createEVMListItemButton = (connector: Connector) => (
    <ListItemButton
      key={connector.uid}
      onClick={() => handleEVMConnect(connector)}
    >
      <ListItemAvatar>
        <Avatar src={connector.icon} alt={connector.name}>
          {connector.name[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={connector.name} />
    </ListItemButton>
  );

  const createSVMListItemButton = (wallet: Wallet) => (
    <ListItemButton
      key={wallet.adapter.name}
      onClick={() => handleSVMConnect(wallet)}
    >
      <ListItemAvatar>
        <Avatar src={wallet.adapter.icon} alt={wallet.adapter.name}>
          {wallet.adapter.name[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={wallet.adapter.name} />
    </ListItemButton>
  );

  console.log({ isDesktopView });

  return (
    <Container disableGutters>
      <List
        sx={{
          paddingLeft: 1.5,
          paddingRight: 1.5,
        }}
      >
        {wallets?.map((connector) =>
          (connector as Connector).uid
            ? createEVMListItemButton(connector as Connector)
            : createSVMListItemButton(connector as Wallet),
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
    </Container>
  );
};
