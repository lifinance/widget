import { Box, Typography } from '@mui/material';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '../../components/Switch';
import { useWidgetConfig } from '../../providers';
import { useSettings, useSettingsStore } from '../../stores';
import { DisabledUI } from '../../types';

export const ShowDestinationWallet = () => {
  const { t } = useTranslation();
  const { disabledUI } = useWidgetConfig();
  const setValue = useSettingsStore((state) => state.setValue);
  const { showDestinationWallet } = useSettings(['showDestinationWallet']);

  if (disabledUI?.includes(DisabledUI.ToAddress)) {
    return null;
  }

  const onChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setValue('showDestinationWallet', checked);
  };

  return (
    <Box px={3} pt={2}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="subtitle1"
            color="text.primary"
            lineHeight="normal"
          >
            {t(`settings.showDestinationWallet`)}
          </Typography>
        </Box>
        <Switch checked={showDestinationWallet} onChange={onChange} />
      </Box>
    </Box>
  );
};
