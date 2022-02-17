import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import { Box, FormControl, MenuItem, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { Select } from '../Select';
import { Switch } from '../Switch';
import { EnabledBridgesSelect } from './EnabledBridgesSelect';
import { EnabledExchangesSelect } from './EnabledExchangesSelect';

export const AdvancedPreferences = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();
  const [advancedPreferences, setAdvancedPreferences] =
    useState<boolean>(false);

  const handleAdvancedPreferences = (
    _: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    setAdvancedPreferences(checked);
  };

  return (
    <Box px={3}>
      <Box
        mt={3}
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
          value={advancedPreferences}
          onChange={handleAdvancedPreferences}
        />
      </Box>
      {advancedPreferences && (
        <Box mt={3} mb={1}>
          <Box sx={{ display: 'flex', alignItems: 'center' }} mb={1}>
            <HelpOutlineIcon sx={{ color: 'grey.500' }} />
            <Typography
              variant="subtitle1"
              color="text.secondary"
              lineHeight="normal"
              ml={1}
            >
              {t(`settings.bridgePrioritization`)}
            </Typography>
          </Box>
          <FormControl fullWidth>
            <Select
              defaultValue={1}
              MenuProps={{ elevation: 2 }}
              inputProps={{
                ...register(SwapFormKey.BridgePrioritization),
              }}
            >
              <MenuItem value={1}>
                {t(`swap.routePriority.recommended`)}
              </MenuItem>
            </Select>
          </FormControl>
          <EnabledBridgesSelect />
          <EnabledExchangesSelect />
        </Box>
      )}
    </Box>
  );
};
