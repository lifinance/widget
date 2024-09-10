import { ChainType } from '@lifi/sdk';
import type { CreateConnectorFnExtended } from '@lifi/wallet-management';
import {
  getConnectorIcon,
  isWalletInstalledAsync,
} from '@lifi/wallet-management';
import { Avatar, ListItemAvatar } from '@mui/material';
import type { Connector } from 'wagmi';
import { useConnect, useDisconnect } from 'wagmi';
import { ListItemButton } from '../../components/ListItemButton.js';
import { ListItemText } from '../../components/ListItemText.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import { WidgetEvent } from '../../types/events.js';

interface EVMListItemButtonProps {
  connectedConnector?: Connector;
  connector: CreateConnectorFnExtended | Connector;
  onNotInstalled(connector: Connector): void;
}

export const EVMListItemButton = ({
  connectedConnector,
  connector,
  onNotInstalled,
}: EVMListItemButtonProps) => {
  const { navigateBack } = useNavigateBack();
  const emitter = useWidgetEvents();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const handleEVMConnect = async () => {
    const identityCheckPassed = await isWalletInstalledAsync(
      (connector as Connector).id,
    );
    if (!identityCheckPassed) {
      onNotInstalled(connector as Connector);
      return;
    }
    if (connectedConnector) {
      await disconnectAsync({ connector: connectedConnector });
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
  };

  const connectorName: string =
    (connector as CreateConnectorFnExtended).displayName || connector.name;

  return (
    <ListItemButton key={connector.id} onClick={handleEVMConnect}>
      <ListItemAvatar>
        <Avatar
          src={getConnectorIcon(connector as Connector)}
          alt={connectorName}
        >
          {connectorName?.[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={connectorName} />
    </ListItemButton>
  );
};
