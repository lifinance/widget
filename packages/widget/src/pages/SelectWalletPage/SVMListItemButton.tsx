import type { Chain } from '@lifi/sdk';
import { ChainId, ChainType } from '@lifi/sdk';
import { Avatar, ListItemAvatar } from '@mui/material';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { ListItemButton } from '../../components/ListItemButton.js';
import { ListItemText } from '../../components/ListItemText.js';
import { useLastConnectedAccount } from '../../hooks/useAccount.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import { WidgetEvent } from '../../types/events.js';

interface SVMListItemButtonProps {
  chain?: Chain;
  walletAdapter: WalletAdapter;
}

export const SVMListItemButton = ({
  chain,
  walletAdapter,
}: SVMListItemButtonProps) => {
  const { navigateBack } = useNavigateBack();
  const emitter = useWidgetEvents();
  const { select, disconnect, connected } = useWallet();
  const { setLastConnectedAccount } = useLastConnectedAccount();

  const connect = async () => {
    if (connected) {
      await disconnect();
    }
    select(walletAdapter.name);
    // We use autoConnect on wallet selection
    // await solanaConnect();
    walletAdapter.once('connect', (publicKey) => {
      setLastConnectedAccount(walletAdapter);
      emitter.emit(WidgetEvent.WalletConnected, {
        address: publicKey?.toString(),
        chainId: ChainId.SOL,
        chainType: ChainType.SVM,
      });
    });
    navigateBack();
  };

  const connectorName: string = chain?.name || walletAdapter.name;

  return (
    <ListItemButton key={connectorName} onClick={connect}>
      <ListItemAvatar>
        <Avatar src={chain?.logoURI || walletAdapter.icon} alt={connectorName}>
          {connectorName[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={connectorName} />
    </ListItemButton>
  );
};
