import { ChainType } from '@lifi/sdk';
import type { CreateConnectorFnExtended } from '@lifi/wallet-management';
import {
  getConnectorIcon,
  isWalletInstalledAsync,
  useConfig,
} from '@lifi/wallet-management';
import { Avatar, ListItemAvatar } from '@mui/material';
import type { Connector } from 'wagmi';
import { connect, disconnect, getAccount } from 'wagmi/actions';
import { ListItemButton } from '../../components/ListItemButton.js';
import { ListItemText } from '../../components/ListItemText.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import { WidgetEvent } from '../../types/events.js';

interface UTXOListItemButtonProps {
  connector: CreateConnectorFnExtended | Connector;
  onNotInstalled(connector: Connector): void;
}

export const UTXOListItemButton = ({
  connector,
  onNotInstalled,
}: UTXOListItemButtonProps) => {
  const { navigateBack } = useNavigateBack();
  const emitter = useWidgetEvents();
  const config = useConfig();

  const handleUTXOConnect = async () => {
    const identityCheckPassed = await isWalletInstalledAsync(
      (connector as Connector).id,
    );
    if (!identityCheckPassed) {
      onNotInstalled(connector as Connector);
      return;
    }
    const connectedAccount = getAccount(config);
    if (connectedAccount.connector) {
      await disconnect(config, { connector: connectedAccount.connector });
    }
    const data = await connect(config, { connector });
    emitter.emit(WidgetEvent.WalletConnected, {
      address: data.accounts[0],
      chainId: data.chainId,
      chainType: ChainType.UTXO,
    });
    navigateBack();
  };

  const connectorName: string =
    (connector as CreateConnectorFnExtended).displayName || connector.name;

  return (
    <ListItemButton key={connector.id} onClick={handleUTXOConnect}>
      <ListItemAvatar>
        <Avatar
          src={getConnectorIcon(connector as Connector)}
          alt={connectorName}
        >
          {connectorName?.[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={`${connectorName} (Bitcoin)`} />
    </ListItemButton>
  );
};
