import { Box } from '@mui/material';
import { ActiveSwaps } from '../../components/ActiveSwaps';
import { ContractComponent } from '../../components/ContractComponent';
import { GasRefuelMessage } from '../../components/GasMessage';
import { SelectChainAndToken } from '../../components/SelectChainAndToken';
import {
  SendToWallet,
  SendToWalletButton,
} from '../../components/SendToWallet';
import { SwapInput } from '../../components/SwapInput';
import { SwapRoutes } from '../../components/SwapRoutes';
import { useExpandableVariant } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { MainGasMessage } from './MainGasMessage';
import { FormContainer } from './MainPage.style';
import { MainSwapButton } from './MainSwapButton';

export const MainPage: React.FC = () => {
  const expandable = useExpandableVariant();
  const { variant } = useWidgetConfig();
  const nft = variant === 'nft';
  return (
    <FormContainer disableGutters>
      <ActiveSwaps mx={3} mt={1} mb={1} />
      {nft ? <ContractComponent mx={3} mt={1} mb={1} /> : null}
      <SelectChainAndToken mt={1} mx={3} mb={2} />
      {!nft ? <SwapInput formType="from" mx={3} mb={2} /> : null}
      {!expandable ? <SwapRoutes mx={3} mb={2} /> : null}
      <SendToWallet mx={3} mb={2} />
      <GasRefuelMessage mx={3} mb={2} />
      <MainGasMessage mx={3} mb={2} />
      <Box display="flex" mx={3} mb={1}>
        <MainSwapButton />
        <SendToWalletButton />
      </Box>
    </FormContainer>
  );
};
