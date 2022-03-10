import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import { Box, Divider, DrawerProps, Typography } from '@mui/material';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ContainerDrawer } from '../ContainerDrawer';
import { RoutePrioritySelect } from '../RoutePrioritySelect';
import { AdvancedPreferences } from './AdvancedPreferences';
import { GasPriceButtonGroup } from './GasPriceButtonGroup';
import { SlippageInput } from './SlippageInput';
import { SettingsDrawerBase } from './types';

export const SettingsDrawer = forwardRef<SettingsDrawerBase, DrawerProps>(
  (_, ref) => {
    const { t } = useTranslation();

    return (
      <ContainerDrawer ref={ref} route="settings">
        <Box role="presentation">
          <Box p={3}>
            <RoutePrioritySelect fullWidth />
            <Box sx={{ display: 'flex', alignItems: 'center' }} mt={3}>
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
                <SlippageInput />
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
