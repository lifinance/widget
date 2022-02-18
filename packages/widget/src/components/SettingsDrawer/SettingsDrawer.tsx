import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import {
  Box,
  Divider,
  DrawerProps,
  FormControl,
  MenuItem,
  Typography,
} from '@mui/material';
import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { ContainerDrawer } from '../ContainerDrawer';
import { Input } from '../Input';
import { Select } from '../Select';
import { AdvancedPreferences } from './AdvancedPreferences';
import { GasPriceButtonGroup } from './GasPriceButtonGroup';
import { SettingsDrawerBase } from './types';

export const SettingsDrawer = forwardRef<SettingsDrawerBase, DrawerProps>(
  (_, ref) => {
    const { t } = useTranslation();
    const { register } = useFormContext();

    return (
      <ContainerDrawer ref={ref} route="settings">
        <Box role="presentation">
          <Box px={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }} mt={3} mb={1}>
              <HelpOutlineIcon sx={{ color: 'grey.500' }} />
              <Typography
                variant="subtitle1"
                color="text.secondary"
                lineHeight="normal"
                ml={1}
              >
                {t(`settings.routePriority.title`)}
              </Typography>
            </Box>
            <FormControl fullWidth>
              <Select
                defaultValue={1}
                MenuProps={{ elevation: 2 }}
                inputProps={{ ...register(SwapFormKey.SwapRoute) }}
              >
                <MenuItem value={1}>
                  {t(`settings.routePriority.recommended`)}
                </MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center' }} my={3}>
              <Box pr={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }} mb={1}>
                  <HelpOutlineIcon
                    sx={{ color: 'grey.500', paddingRight: 1 }}
                  />
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    lineHeight="normal"
                  >
                    {t(`settings.slippage`)}
                  </Typography>
                </Box>
                <FormControl fullWidth>
                  <Input
                    size="small"
                    placeholder={t(`settings.slippage`)}
                    required
                    inputProps={{ ...register(SwapFormKey.Slippage) }}
                  />
                </FormControl>
              </Box>
              <GasPriceButtonGroup />
            </Box>
          </Box>
          <Divider light />
          <AdvancedPreferences />
        </Box>
      </ContainerDrawer>
    );
  },
);
