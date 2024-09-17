import type { Chain } from '@lifi/sdk';
import { ChainType } from '@lifi/sdk';
import type { CreateConnectorFnExtended } from '@lifi/wallet-management';
import {
  getConnectorIcon,
  isWalletInstalledAsync,
} from '@lifi/wallet-management';
import { Avatar, ListItemAvatar } from '@mui/material';
import type { Connector } from 'wagmi';
import { useConfig } from 'wagmi';
import { connect, disconnect, getAccount } from 'wagmi/actions';
import { ListItemButton } from '../../components/ListItemButton.js';
import { ListItemText } from '../../components/ListItemText.js';
import { useLastConnectedAccount } from '../../hooks/useAccount.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import { WidgetEvent } from '../../types/events.js';

interface EVMListItemButtonProps {
  chain?: Chain;
  connector: CreateConnectorFnExtended | Connector;
  onNotInstalled(connector: Connector): void;
}

export const EVMListItemButton = ({
  chain,
  connector,
  onNotInstalled,
}: EVMListItemButtonProps) => {
  const { navigateBack } = useNavigateBack();
  const emitter = useWidgetEvents();
  const config = useConfig();
  const { setLastConnectedAccount } = useLastConnectedAccount();

  const handleEVMConnect = async () => {
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
    setLastConnectedAccount(connector);
    emitter.emit(WidgetEvent.WalletConnected, {
      address: data.accounts[0],
      chainId: data.chainId,
      chainType: ChainType.EVM,
    });
    navigateBack();
  };

  const connectorName: string =
    chain?.name ||
    (connector as CreateConnectorFnExtended).displayName ||
    connector.name;

  return (
    <ListItemButton key={connector.id} onClick={handleEVMConnect}>
      <ListItemAvatar>
        <Avatar
          src={chain?.logoURI || getConnectorIcon(connector as Connector)}
          alt={connectorName}
        >
          {connectorName?.[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={connectorName} />
    </ListItemButton>
  );
};
