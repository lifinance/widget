import { Box, Container, Divider } from '@mui/material';
import { RoutePrioritySelect } from '../../components/RoutePrioritySelect';
import { AdvancedPreferences } from './AdvancedPreferences';
import { GasPriceButtonGroup } from './GasPriceButtonGroup';
import { SlippageInput } from './SlippageInput';

export const SettingsPage = () => {
  return (
    <Container disableGutters>
      <Box px={3} pt={1} pb={3}>
        <RoutePrioritySelect fullWidth />
        <Box sx={{ display: 'flex', alignItems: 'center' }} mt={3}>
          <Box pr={2}>
            <SlippageInput />
          </Box>
          <GasPriceButtonGroup />
        </Box>
      </Box>
      <Divider light />
      <AdvancedPreferences />
    </Container>
  );
};
