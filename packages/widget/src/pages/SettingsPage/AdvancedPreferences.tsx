import { Box, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '../../components/Switch';
import { useSetSettings, useSettings } from '../../stores';
import { EnabledBridgesSelect } from './EnabledBridgesSelect';
import { EnabledExchangesSelect } from './EnabledExchangesSelect';

export const AdvancedPreferences = () => {
  const { t } = useTranslation();
  const [setValue] = useSetSettings();
  const { advancedPreferences } = useSettings(['advancedPreferences']);

  const handleAdvancedPreferences = (
    _: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    setValue('advancedPreferences', checked);
  };

  return (
    <Box p={3}>
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
            {t(`settings.advancedPreferences`)}
          </Typography>
        </Box>
        <Switch
          checked={advancedPreferences}
          onChange={handleAdvancedPreferences}
        />
      </Box>
      {advancedPreferences && (
        <Box mt={3} mb={1}>
          <EnabledBridgesSelect />
          <Box mt={2}>
            <EnabledExchangesSelect />
          </Box>
        </Box>
      )}
    </Box>
  );
};
