import { Box } from '@mui/material';
import { ActiveTransactions } from '../../components/ActiveTransactions/ActiveTransactions.js';
import { AmountInput } from '../../components/AmountInput/AmountInput.js';
import { ContractComponent } from '../../components/ContractComponent/ContractComponent.js';
import { GasRefuelMessage } from '../../components/GasMessage/GasRefuelMessage.js';
import { PageContainer } from '../../components/PageContainer.js';
import { Routes } from '../../components/Routes/Routes.js';
import { SelectChainAndToken } from '../../components/SelectChainAndToken.js';
import { SendToWalletButton } from '../../components/SendToWallet/SendToWalletButton.js';
import { SendToWalletExpandButton } from '../../components/SendToWallet/SendToWalletExpandButton.js';
import { useExpandableVariant } from '../../hooks/useExpandableVariant.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { MainGasMessage } from './MainGasMessage.js';
import { ReviewButton } from './ReviewButton.js';

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
      <SendToWalletButton mb={2} />
      <GasRefuelMessage mb={2} />
      <MainGasMessage mb={2} />
      <Box display="flex" mb={1}>
        <ReviewButton />
        <SendToWalletExpandButton />
      </Box>
    </PageContainer>
  );
};
