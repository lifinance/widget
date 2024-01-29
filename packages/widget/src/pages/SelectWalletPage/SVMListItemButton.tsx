import { ChainId, ChainType } from '@lifi/sdk';
import { Avatar, ListItemAvatar } from '@mui/material';
import type { Wallet } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ListItemButton } from '../../components/ListItemButton';
import { ListItemText } from '../../components/ListItemText';
import { useNavigateBack, useWidgetEvents } from '../../hooks';
import { WidgetEvent } from '../../types';

interface SVMListItemButtonProps {
  wallet: Wallet;
}

export const SVMListItemButton = ({ wallet }: SVMListItemButtonProps) => {
  const { navigateBack } = useNavigateBack();
  const emitter = useWidgetEvents();
  const { select, disconnect, connected } = useWallet();

  const connect = async () => {
    if (connected) {
      await disconnect();
    }
    select(wallet.adapter.name);
    // We use autoConnect on wallet selection
    // await solanaConnect();
    wallet.adapter.once('connect', (publicKey) => {
      emitter.emit(WidgetEvent.WalletConnected, {
        address: publicKey?.toString(),
        chainId: ChainId.SOL,
        chainType: ChainType.SVM,
      });
    });
    navigateBack();
  };

  return (
    <ListItemButton key={wallet.adapter.name} onClick={connect}>
      <ListItemAvatar>
        <Avatar src={wallet.adapter.icon} alt={wallet.adapter.name}>
          {wallet.adapter.name[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={`${wallet.adapter.name} (Solana)`} />
    </ListItemButton>
  );
};
