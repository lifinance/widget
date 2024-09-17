import { ChainId, ChainType } from '@lifi/sdk';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  DialogActions,
  DialogContent,
  DialogContentText,
  List,
  ListItemAvatar,
} from '@mui/material';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Connector } from 'wagmi';
import { Card } from '../../components/Card/Card.js';
import { CardTitle } from '../../components/Card/CardTitle.js';
import { Dialog } from '../../components/Dialog.js';
import { ListItemButton } from '../../components/ListItemButton.js';
import { ListItemText } from '../../components/ListItemText.js';
import { PageContainer } from '../../components/PageContainer.js';
import { useAvailableChains } from '../../hooks/useAvailableChains.js';
import { useCombinedWallets } from '../../hooks/useCombinedWallets.js';
import { useHeader } from '../../hooks/useHeader.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import type { WalletConnector } from '../../types/walletConnector.js';
import { EVMListItemButton } from './EVMListItemButton.js';
import { SVMListItemButton } from './SVMListItemButton.js';
import { UTXOListItemButton } from './UTXOListItemButton.js';

export const SelectWalletPage = () => {
  const { t } = useTranslation();
  const { chains, walletConfig } = useWidgetConfig();
  const [walletIdentity, setWalletIdentity] = useState<{
    show: boolean;
    connector?: Connector;
  }>({ show: false });
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null);
  const { getChainById } = useAvailableChains();

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

  const { installedWallets } = useCombinedWallets(walletConfig, chains);

  const handleExpandClick = (walletName: string) => {
    setExpandedWallet((prev) => (prev === walletName ? null : walletName));
  };

  const getWalletButton = (
    name: string,
    chainType: ChainType,
    connector: WalletConnector,
    ecosystemSelection?: boolean,
  ) => {
    const key = `${name}${ecosystemSelection ? `-${chainType}` : ''}`;
    switch (chainType) {
      case ChainType.UTXO: {
        const chain = ecosystemSelection
          ? getChainById(ChainId.BTC)
          : undefined;
        return (
          <UTXOListItemButton
            key={key}
            chain={chain}
            connector={connector as Connector}
            onNotInstalled={handleNotInstalled}
          />
        );
      }
      case ChainType.EVM: {
        const chain = ecosystemSelection
          ? getChainById(ChainId.ETH)
          : undefined;
        return (
          <EVMListItemButton
            key={key}
            chain={chain}
            connector={connector as Connector}
            onNotInstalled={handleNotInstalled}
          />
        );
      }
      case ChainType.SVM: {
        const chain = ecosystemSelection
          ? getChainById(ChainId.SOL)
          : undefined;
        return (
          <SVMListItemButton
            key={key}
            chain={chain}
            walletAdapter={connector as WalletAdapter}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <PageContainer disableGutters>
      <List
        sx={{
          paddingTop: 0,
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingBottom: 1.5,
        }}
      >
        {installedWallets.map(({ connectors, name, icon }) => {
          if (connectors.length === 1) {
            const { chainType, connector } = connectors[0];
            return getWalletButton(name, chainType, connector);
          } else {
            const isExpanded = expandedWallet === name;
            return (
              <Box key={name}>
                <ListItemButton onClick={() => handleExpandClick(name)}>
                  <ListItemAvatar>
                    <Avatar src={icon} alt={name}>
                      {name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={name} />
                </ListItemButton>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box m={1.5}>
                    <Card>
                      <CardTitle mb={1}>Select ecosystem for {name}</CardTitle>
                      {connectors.map(({ chainType, connector }) =>
                        getWalletButton(name, chainType, connector, true),
                      )}
                    </Card>
                  </Box>
                </Collapse>
              </Box>
            );
          }
        })}
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
