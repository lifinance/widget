import { Box, Container } from '@mui/material';
import { EnabledToolsButton } from './EnabledToolsButton';
import { LanguageSelect } from './LanguageSelect';
import { ResetSettingsButton } from './ResetSettingsButton';
import { ShowDestinationWallet } from './ShowDestinationWallet';
import { SlippageInput } from './SlippageInput';

import { GasPriceSettings } from './GasPriceSettings';
import { RoutePrioritySettings } from './RoutePrioritySettings';
import { ThemeSettings } from './ThemeSettings';

export const SettingsPage = () => {
  return (
    <Container disableGutters>
      <Box px={3} pt={1}>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}
          pb={2}
        >
          <ThemeSettings />
          <RoutePrioritySettings />
          <GasPriceSettings />
        </Box>
        <LanguageSelect />
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
