/* eslint-disable no-console */
import { Box, Button, Typography } from '@mui/material';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function WalletHeader() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connectAsync } = useConnect();

  return (
    <Box
      p={2}
      mb={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px solid #EEE"
    >
      <Typography px={2} fontWeight={600} fontSize={24}>
        Example
      </Typography>
      <Box display="flex" alignItems="center">
        <Typography px={2}>{address}</Typography>
        {!isConnected ? (
          <Button
            variant="contained"
            disableElevation
            onClick={() => connectAsync({ connector: connectors[0] })}
          >
            Connect
          </Button>
        ) : (
          <Button
            variant="contained"
            disableElevation
            onClick={() => disconnect()}
          >
            Disconnect
          </Button>
        )}
      </Box>
    </Box>
  );
}
