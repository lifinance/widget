import { Box } from '@mui/material';
import { SelectChainAndToken } from '../../components/SelectChainAndToken';
import { SwapInProgress } from '../../components/SwapInProgress';
import { SwapInput } from '../../components/SwapInput';
import { FormContainer } from './MainPage.style';
import { MainSwapButton } from './MainSwapButton';
import { SwapRoutes } from './SwapRoutes';

export const MainPage: React.FC = () => {
  return (
    <FormContainer disableGutters>
      <SwapInProgress mx={3} mt={2} mb={1} />
      <SelectChainAndToken mt={2} mx={3} mb={3} />
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
