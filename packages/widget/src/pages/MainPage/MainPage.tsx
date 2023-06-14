import { Box } from '@mui/material';
import { ActiveTransactions } from '../../components/ActiveTransactions';
import { AmountInput } from '../../components/AmountInput';
import { ContractComponent } from '../../components/ContractComponent';
import { GasRefuelMessage } from '../../components/GasMessage';
import { Routes } from '../../components/Routes';
import { SelectChainAndToken } from '../../components/SelectChainAndToken';
import {
  SendToWallet,
  SendToWalletButton,
} from '../../components/SendToWallet';
import { useExpandableVariant } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { MainGasMessage } from './MainGasMessage';
import { FormContainer } from './MainPage.style';
import { ReviewButton } from './ReviewButton';

export const MainPage: React.FC = () => {
  const expandable = useExpandableVariant();
  const { subvariant, contractComponent } = useWidgetConfig();
  const nft = subvariant === 'nft';
  return (
    <FormContainer disableGutters>
      <ActiveTransactions mx={3} mt={1} mb={1} />
      {nft ? (
        <ContractComponent mx={3} mt={1} mb={1}>
          {contractComponent}
        </ContractComponent>
      ) : null}
      <SelectChainAndToken mt={1} mx={3} mb={2} />
      {!nft ? <AmountInput formType="from" mx={3} mb={2} /> : null}
      {!expandable ? <Routes mx={3} mb={2} /> : null}
      <SendToWallet mx={3} mb={2} />
      <GasRefuelMessage mx={3} mb={2} />
      <MainGasMessage mx={3} mb={2} />
      <Box display="flex" mx={3} mb={1}>
        <ReviewButton />
        <SendToWalletButton />
      </Box>
    </FormContainer>
  );
};
