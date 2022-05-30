import { Box, Container } from '@mui/material';
import { AdvancedPreferences } from './AdvancedPreferences';
import { ColorSchemeButtonGroup } from './ColorSchemeButtonGroup';
import { GasPriceSelect } from './GasPriceSelect';
import { RoutePrioritySelect } from './RoutePrioritySelect';
import { SlippageInput } from './SlippageInput';

export const SettingsPage = () => {
  return (
    <Container disableGutters>
      <Box px={3} pt={1}>
        <Box pb={2}>
          <ColorSchemeButtonGroup />
        </Box>
        <RoutePrioritySelect />
        <Box sx={{ display: 'flex', alignItems: 'center' }} mt={2}>
          <Box pr={2} flex={1}>
            <SlippageInput />
          </Box>
          <GasPriceSelect />
        </Box>
      </Box>
      <AdvancedPreferences />
    </Container>
  );
};
