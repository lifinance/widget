import { Box, Button } from '@mui/material';
import { useAccount, useConnect, useConnectors, useDisconnect } from 'wagmi';
import WalletIcon from '@mui/icons-material/Wallet';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { shortenAddress } from '../../utils';
import { ConnectionWalletButtonBase } from './ConnectingWalletButton.style';

interface ConnectingWalletButtonProps {
  sx: SxProps<Theme>;
}
export const ConnectingWalletButton = ({ sx }: ConnectingWalletButtonProps) => {
  const connectors = useConnectors();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const account = useAccount();

  return account.isConnected && account.address ? (
    <ConnectionWalletButtonBase
      sx={sx}
      variant="contained"
      endIcon={<PowerSettingsNewIcon />}
      onClick={() => disconnect()}
    >
      <Box pr={1}>{shortenAddress(account.address)}</Box>
      {' | '}
      <Box pl={1}>Disconnect</Box>
    </ConnectionWalletButtonBase>
  ) : (
    <ConnectionWalletButtonBase
      sx={sx}
      variant="contained"
      endIcon={<WalletIcon />}
      onClick={() => connect({ connector: connectors[0] })}
    >
      Connect wallet
    </ConnectionWalletButtonBase>
  );
};
