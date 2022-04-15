import { Box, Container, Divider } from '@mui/material';
import { RoutePrioritySelect } from '../../components/RoutePrioritySelect';
import { useWallet } from '../../providers/WalletProvider';
import { AdvancedPreferences } from './AdvancedPreferences';
import { GasPriceButtonGroup } from './GasPriceButtonGroup';
import { SlippageInput } from './SlippageInput';

export const SettingsPage = () => {
  const { account, disconnect } = useWallet();
  return (
    <Container disableGutters>
      <Box role="presentation">
        <Box p={3}>
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
      </Box>
    </Container>
  );
};
