import { Box, Button } from '@mui/material';
import { useAccount, useConnect, useConnectors, useDisconnect } from 'wagmi';

export const WalletButtons = () => {
  const connectors = useConnectors();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const account = useAccount();

  return (
    <Box m={2}>
      {account.address}
      {account.isConnected && account.address ? (
        <Button variant="contained" onClick={() => disconnect()}>
          Disconnect
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={() => connect({ connector: connectors[0] })}
        >
          Connect
        </Button>
      )}
    </Box>
  );
};
