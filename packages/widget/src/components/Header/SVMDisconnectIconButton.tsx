import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNewRounded';
import { IconButton } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';

export const SVMDisconnectIconButton = () => {
  const { disconnect } = useWallet();

  return (
    <IconButton
      size="medium"
      onClick={(e) => {
        e.stopPropagation();
        disconnect();
      }}
    >
      <PowerSettingsNewIcon />
    </IconButton>
  );
};
