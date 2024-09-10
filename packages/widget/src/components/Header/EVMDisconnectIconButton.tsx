import { PowerSettingsNewRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import type { Connector } from 'wagmi';
import { useConfig } from 'wagmi';
import { disconnect } from 'wagmi/actions';

export const EVMDisconnectIconButton = ({
  connector,
}: {
  connector?: Connector;
}) => {
  const config = useConfig();
  return (
    <IconButton
      size="medium"
      onClick={async (e) => {
        e.stopPropagation();
        await disconnect(config, { connector });
      }}
    >
      <PowerSettingsNewRounded />
    </IconButton>
  );
};
