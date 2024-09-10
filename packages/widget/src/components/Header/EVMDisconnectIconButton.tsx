import { PowerSettingsNewRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import type { Connector } from 'wagmi';
import { useDisconnect } from 'wagmi';

export const EVMDisconnectIconButton = ({
  connector,
}: {
  connector?: Connector;
}) => {
  const { disconnect } = useDisconnect();

  return (
    <IconButton
      size="medium"
      onClick={(e) => {
        e.stopPropagation();
        disconnect({ connector });
      }}
    >
      <PowerSettingsNewRounded />
    </IconButton>
  );
};
