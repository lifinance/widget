import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import {
  Box,
  Divider,
  DrawerProps,
  FormControl,
  MenuItem,
  Typography,
} from '@mui/material';
import { ChangeEvent, forwardRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { ContainerDrawer } from '../ContainerDrawer';
import { Input } from '../Input';
import { Select } from '../Select';
import { Switch } from '../Switch';
import { EnabledBridgesSelect } from './EnabledBridgesSelect';
import { EnabledExchangesSelect } from './EnabledExchangesSelect';
import { Button, ButtonGroup } from './SettingsDrawer.style';
import { SettingsDrawerBase } from './types';

export const SettingsDrawer = forwardRef<SettingsDrawerBase, DrawerProps>(
  (_, ref) => {
    const { t } = useTranslation();
    const { register } = useFormContext();
    const [value, setValue] = useState<'slow' | 'normal' | 'fast'>('normal');
    const [advancedPreferences, setAdvancedPreferences] =
      useState<boolean>(false);

    const handleChange = (newValue: 'slow' | 'normal' | 'fast') => {
      setValue(newValue);
    };

    const handleAdvancedPreferences = (
      _: ChangeEvent<HTMLInputElement>,
      checked: boolean,
    ) => {
      setAdvancedPreferences(checked);
    };

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
                {t(`settings.route`)}
              </Typography>
            </Box>
            <FormControl fullWidth>
              <Select
                defaultValue={1}
                MenuProps={{ elevation: 2 }}
                inputProps={{ ...register(SwapFormKey.SwapRoute) }}
              >
                <MenuItem value={1}>
                  {t(`swap.routePriority.recommended`)}
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
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }} mb={1}>
                  <HelpOutlineIcon sx={{ color: 'grey.500' }} />
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    lineHeight="normal"
                    ml={1}
                  >
                    {t(`settings.gasPrice.title`)}
                  </Typography>
                </Box>
                <ButtonGroup size="large">
                  <Button
                    key="slow"
                    disableElevation
                    variant={value === 'slow' ? 'contained' : 'outlined'}
                    onClick={() => handleChange('slow')}
                  >
                    {t(`settings.gasPrice.slow`)}
                  </Button>
                  <Button
                    key="normal"
                    disableElevation
                    variant={value === 'normal' ? 'contained' : 'outlined'}
                    onClick={() => handleChange('normal')}
                  >
                    {t(`settings.gasPrice.normal`)}
                  </Button>
                  <Button
                    key="fast"
                    disableElevation
                    variant={value === 'fast' ? 'contained' : 'outlined'}
                    onClick={() => handleChange('fast')}
                  >
                    {t(`settings.gasPrice.fast`)}
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
          </Box>
          <Divider light />
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
        </Box>
      </ContainerDrawer>
    );
  },
);
