import { Box, Button } from '@mui/material';
import { useWallet } from '../providers/WalletProvider';

export const WalletButtons = () => {
  const { connect, disconnect, account } = useWallet();

  return (
    <Box m={2}>
      {account.isActive && account.address ? (
        <Button variant="contained" onClick={() => disconnect()}>
          Disconnect
        </Button>
      ) : (
        <Button variant="contained" onClick={() => connect()}>
          Connect
        </Button>
      )}
    </Box>
  );
};
