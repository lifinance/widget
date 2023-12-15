import { Box } from '@mui/material';
import { ActiveTransactions } from '../../components/ActiveTransactions';
import { AmountInput } from '../../components/AmountInput';
import { ContractComponent } from '../../components/ContractComponent';
import { GasRefuelMessage } from '../../components/GasMessage';
import { PageContainer } from '../../components/PageContainer';
import { Routes } from '../../components/Routes';
import { SelectChainAndToken } from '../../components/SelectChainAndToken';
import {
  SendToWalletButton,
  SendToWalletExpandButton,
} from '../../components/SendToWallet';
import { useExpandableVariant } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { MainGasMessage } from './MainGasMessage';
import { ReviewButton } from './ReviewButton';

export const MainPage: React.FC = () => {
  const expandable = useExpandableVariant();
  const { subvariant, contractComponent } = useWidgetConfig();
  const nft = subvariant === 'nft';
  return (
    <PageContainer>
      <ActiveTransactions mt={1} mb={2} />
      {nft ? (
        <ContractComponent mt={1} mb={2}>
          {contractComponent}
        </ContractComponent>
      ) : null}
      <SelectChainAndToken mt={1} mb={2} />
      {!nft ? <AmountInput formType="from" mb={2} /> : null}
      {!expandable ? <Routes mb={2} /> : null}
      <SendToWalletButton />
      <GasRefuelMessage mb={2} />
      <MainGasMessage mb={2} />
      <Box display="flex" mb={1}>
        <ReviewButton />
        <SendToWalletExpandButton />
      </Box>
    </PageContainer>
  );
};
