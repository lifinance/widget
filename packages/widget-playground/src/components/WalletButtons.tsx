import { Box, Button } from '@mui/material';
import { useWallet } from '../providers/WalletProvider';
import { METAMASK_WALLET } from '../config';

export const WalletButtons = () => {
  const { connect, disconnect, account } = useWallet();

  return (
    <Box m={2}>
      {account.isActive && account.address ? (
        <Button variant="contained" onClick={() => disconnect(METAMASK_WALLET)}>
          Disconnect
        </Button>
      ) : (
        <Button variant="contained" onClick={() => connect(METAMASK_WALLET)}>
          Connect
        </Button>
      )}
    </Box>
  );
};
