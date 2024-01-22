import EvStationIcon from '@mui/icons-material/EvStation';
import type { BoxProps } from '@mui/material';
import { Box, Collapse, Typography } from '@mui/material';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useGasRefuel } from '../../hooks';
import { useSettings, useSettingsStore } from '../../stores';
import { AlertMessage } from '../AlertMessage';
import { InfoMessageSwitch } from './GasMessage.style';

export const GasRefuelMessage: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const setValue = useSettingsStore((state) => state.setValue);
  const { enabledAutoRefuel } = useSettings(['enabledAutoRefuel']);

  const { enabled, chain, isLoading: isRefuelLoading } = useGasRefuel();

  const onChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setValue('enabledAutoRefuel', checked);
  };

  const showGasRefuelMessage = chain && enabled && !isRefuelLoading;

  return (
    <Collapse
      timeout={225}
      in={showGasRefuelMessage}
      unmountOnExit
      mountOnEnter
    >
      <AlertMessage
        icon={<EvStationIcon />}
        title={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexGrow={1}
          >
            <Typography variant="body2" fontWeight={700}>
              {t(`info.title.autoRefuel`)}
            </Typography>
            <InfoMessageSwitch
              checked={enabledAutoRefuel}
              onChange={onChange}
            />
          </Box>
        }
        {...props}
      >
        <Collapse
          timeout={225}
          in={enabledAutoRefuel}
          unmountOnExit
          mountOnEnter
        >
          <Typography variant="body2" px={2} pt={1}>
            {t(`info.message.autoRefuel`, {
              chainName: chain?.name,
            })}
          </Typography>
        </Collapse>
      </AlertMessage>
    </Collapse>
  );
};
