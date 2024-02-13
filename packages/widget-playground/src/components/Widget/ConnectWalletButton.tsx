import { Box } from '@mui/material';
import { useAccount, useConnect, useConnectors, useDisconnect } from 'wagmi';
import WalletIcon from '@mui/icons-material/Wallet';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { shortenAddress } from '../../utils';
import { ConnectionWalletButtonBase } from './WidgetView.style';

export const ConnectWalletButton = () => {
  const connectors = useConnectors();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const account = useAccount();

  return account.isConnected && account.address ? (
    <ConnectionWalletButtonBase
      variant="contained"
      endIcon={<PowerSettingsNewIcon />}
      onClick={() => disconnect()}
    >
      <Box pr={1}>{shortenAddress(account.address)}</Box>|
      <Box pl={1}>Disconnect</Box>
    </ConnectionWalletButtonBase>
  ) : (
    <ConnectionWalletButtonBase
      variant="contained"
      endIcon={<WalletIcon />}
      onClick={() => connect({ connector: connectors[0] })}
    >
      Connect wallet
    </ConnectionWalletButtonBase>
  );
};
