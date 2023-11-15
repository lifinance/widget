import { Box, Container } from '@mui/material';
import { EnabledToolsButton } from './EnabledToolsButton';
import { GasPriceSelect } from './GasPriceSelect';
import { LanguageSelect } from './LanguageSelect';
import { ResetSettingsButton } from './ResetSettingsButton';
import { RoutePrioritySelect } from './RoutePrioritySelect';
import { ShowDestinationWallet } from './ShowDestinationWallet';
import { SlippageInput } from './SlippageInput';

import { ThemeSettings } from './ThemeSettings';
import { GasPriceSettings } from './GasPriceSettings';

export const SettingsPage = () => {
  return (
    <Container disableGutters>
      <Box px={3} pt={1}>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}
          pb={2}
        >
          <ThemeSettings />
          <GasPriceSettings />
        </Box>
        <LanguageSelect />
        <RoutePrioritySelect />
        <Box sx={{ display: 'flex', alignItems: 'center' }} mt={2}>
          <Box flex={1}>
            <SlippageInput />
          </Box>
        </Box>
      </Box>
      <ShowDestinationWallet />
      <Box px={1.5}>
        <EnabledToolsButton type="Bridges" />
        <EnabledToolsButton type="Exchanges" />
      </Box>
      <ResetSettingsButton />
    </Container>
  );
};
