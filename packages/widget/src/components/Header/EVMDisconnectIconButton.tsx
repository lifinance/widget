import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNewRounded';
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
      <PowerSettingsNewIcon />
    </IconButton>
  );
};
