import { Box } from '@mui/material';
import { ActiveSwaps } from '../../components/ActiveSwaps';
import { SelectChainAndToken } from '../../components/SelectChainAndToken';
import { SwapInput } from '../../components/SwapInput';
import { FormContainer } from './MainPage.style';
import { MainSwapButton } from './MainSwapButton';
import { SwapRoutes } from './SwapRoutes';

export const MainPage: React.FC = () => {
  return (
    <FormContainer disableGutters>
      <ActiveSwaps mx={3} mt={1} mb={2} />
      <SelectChainAndToken mt={1} mx={3} mb={3} />
      <Box mx={3} mb={3}>
        <SwapInput formType="from" />
      </Box>
      <SwapRoutes mx={3} mb={3} />
      <Box mx={3} mb={1}>
        <MainSwapButton />
      </Box>
    </FormContainer>
  );
};
