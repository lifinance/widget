import { SwapVert as SwapVertIcon } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SelectTokenButton } from '../../components/SelectTokenButton';
import { SwapButton } from '../../components/SwapButton';
import { SwapRoute } from '../../components/SwapRoute';
import { SwapFormDirection } from '../../providers/SwapFormProvider';
import { ElementId } from '../../utils/elements';
import { FormBox, FormCard, FormContainer } from './SwapPage.style';

export const SwapPage: React.FC = () => {
  const { t } = useTranslation();

  const handleChainButton = (formType: SwapFormDirection) => {
    //
  };

  return (
    <FormContainer id={ElementId.SwapContent} disableGutters>
      <FormBox>
        <FormCard>
          <SelectTokenButton onClick={handleChainButton} formType="from" />
        </FormCard>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', height: 40 }}
          py={0.5}
        >
          <SwapVertIcon sx={{ alignSelf: 'center', padding: '0 16px' }} />
        </Box>
        <FormCard mb={3}>
          <SelectTokenButton onClick={handleChainButton} formType="to" />
        </FormCard>
        {/* <SendToRecipientForm /> */}
        {/* <RoutePrioritySelect /> */}
        {/* <FormCard mb={3}> */}
        <SwapRoute />
        {/* </FormCard> */}
      </FormBox>
      <Box px={3} pb={3}>
        <SwapButton />
      </Box>
      {/* <SelectWalletDrawer ref={selectWalletDrawerRef} />
      <SelectTokenDrawer ref={selectTokenDrawerRef} />
      <SettingsDrawer ref={settingsRef} /> */}
    </FormContainer>
  );
};
