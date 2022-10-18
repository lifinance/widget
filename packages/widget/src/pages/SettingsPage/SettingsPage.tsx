import { Box, Container } from '@mui/material';
import { AdvancedPreferences } from './AdvancedPreferences';
import { ColorSchemeButtonGroup } from './ColorSchemeButtonGroup';
import { GasPriceSelect } from './GasPriceSelect';
import { LanguageSelect } from './LanguageSelect';
import { RoutePrioritySelect } from './RoutePrioritySelect';
import { ShowDestinationWallet } from './ShowDestinationWallet';
import { SlippageInput } from './SlippageInput';

export const SettingsPage = () => {
  return (
    <Container disableGutters>
      <Box px={3} pt={1}>
        <ColorSchemeButtonGroup />
        <LanguageSelect />
        <RoutePrioritySelect />
        <Box sx={{ display: 'flex', alignItems: 'center' }} mt={2}>
          <Box pr={2} flex={1}>
            <SlippageInput />
          </Box>
          <GasPriceSelect />
        </Box>
      </Box>
      <ShowDestinationWallet />
      <AdvancedPreferences />
    </Container>
  );
};
