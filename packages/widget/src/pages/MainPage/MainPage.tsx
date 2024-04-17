import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ActiveTransactions } from '../../components/ActiveTransactions/ActiveTransactions.js';
import { AmountInput } from '../../components/AmountInput/AmountInput.js';
import { ContractComponent } from '../../components/ContractComponent/ContractComponent.js';
import { GasRefuelMessage } from '../../components/GasMessage/GasRefuelMessage.js';
import { PageContainer } from '../../components/PageContainer.js';
import { PoweredBy } from '../../components/PoweredBy/PoweredBy.js';
import { Routes } from '../../components/Routes/Routes.js';
import { SelectChainAndToken } from '../../components/SelectChainAndToken.js';
import { SendToWalletButton } from '../../components/SendToWallet/SendToWalletButton.js';
import { SendToWalletExpandButton } from '../../components/SendToWallet/SendToWalletExpandButton.js';
import { useHeader } from '../../hooks/useHeader.js';
import { useWideVariant } from '../../hooks/useWideVariant.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { HiddenUI } from '../../types/widget.js';
import { MainMessages } from './MainMessages.js';
import { ReviewButton } from './ReviewButton.js';

export const MainPage: React.FC = () => {
  const { t } = useTranslation();
  const wideVariant = useWideVariant();
  const { subvariant, contractComponent, hiddenUI } = useWidgetConfig();
  const custom = subvariant === 'custom';
  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy);

  const title =
    subvariant === 'custom'
      ? t(`header.checkout`)
      : subvariant === 'refuel'
        ? t(`header.gas`)
        : t(`header.exchange`);
  useHeader(title);

  return (
    <PageContainer>
      <ActiveTransactions sx={{ marginBottom: 2 }} />
      {custom ? (
        <ContractComponent sx={{ marginBottom: 2 }}>
          {contractComponent}
        </ContractComponent>
      ) : null}
      <SelectChainAndToken mb={2} />
      {!custom ? (
        <AmountInput formType="from" sx={{ marginBottom: 2 }} />
      ) : null}
      {!wideVariant ? <Routes sx={{ marginBottom: 2 }} /> : null}
      <SendToWalletButton sx={{ marginBottom: 2 }} />
      <GasRefuelMessage mb={2} />
      <MainMessages mb={2} />
      <Box display="flex" mb={showPoweredBy ? 1 : 3} gap={1.5}>
        <ReviewButton />
        <SendToWalletExpandButton />
      </Box>
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  );
};
