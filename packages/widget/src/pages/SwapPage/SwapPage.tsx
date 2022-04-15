import { SwapVert as SwapVertIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SwapButton } from '../../components/SwapButton';
import { SwapChainButton } from '../../components/SwapChainButton';
import { SwapInput } from '../../components/SwapInput';
import { SwapRoute } from '../../components/SwapRoute';
import { SwapFormDirection } from '../../providers/SwapFormProvider';
import { ElementId } from '../../utils/elements';
import { FormBox, FormContainer } from './SwapPage.style';

export const SwapPage: React.FC = () => {
  const { t } = useTranslation();

  const handleChainButton = (formType: SwapFormDirection) => {
    //
  };

  return (
    <FormContainer id={ElementId.SwapContent} disableGutters>
      <FormBox>
        <Typography variant="subtitle1" color="text.secondary" mt={2} mb={0.5}>
          {t(`swap.from`)}
        </Typography>
        <SwapChainButton onClick={handleChainButton} formType="from" />
        <SwapInput formType="from" />
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', height: 40 }}
          my={0.5}
        >
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ alignSelf: 'end' }}
          >
            {t(`swap.to`)}
          </Typography>
          <SwapVertIcon sx={{ alignSelf: 'center', padding: '0 16px' }} />
        </Box>
        <Box pb={3}>
          <SwapChainButton onClick={handleChainButton} formType="to" />
          <SwapInput formType="to" />
        </Box>
        {/* <SendToRecipientForm /> */}
        {/* <RoutePrioritySelect /> */}
        <SwapRoute />
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
