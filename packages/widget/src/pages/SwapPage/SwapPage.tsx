import { SwapVert as SwapVertIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SelectTokenDrawer,
  SelectTokenDrawerBase,
} from '../../components/SelectTokenDrawer';
import {
  SelectWalletDrawer,
  SelectWalletDrawerBase,
} from '../../components/SelectWalletDrawer';
import { SettingsDrawer } from '../../components/SettingsDrawer';
import { SwapButton } from '../../components/SwapButton';
import { SwapChainButton } from '../../components/SwapChainButton';
import { SwapInput } from '../../components/SwapInput';
import { SwapRoute } from '../../components/SwapRoute';
import {
  SwapFormDirection,
  SwapFormKeyHelper,
} from '../../providers/SwapFormProvider';
import { ElementId } from '../../utils/elements';
import { FormBox, FormContainer } from './SwapPage.style';
import { SwapPageProps } from './types';

export const SwapPage: React.FC<SwapPageProps> = ({ settingsRef }) => {
  const { t } = useTranslation();
  const selectTokenDrawerRef = useRef<SelectTokenDrawerBase>(null);
  const selectWalletDrawerRef = useRef<SelectWalletDrawerBase>(null);

  const handleChainButton = (formType: SwapFormDirection) =>
    selectTokenDrawerRef.current?.openDrawer(
      formType,
      SwapFormKeyHelper.getTokenKey(formType),
    );

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
        <SwapButton drawerRef={selectWalletDrawerRef} />
      </Box>
      <SelectWalletDrawer ref={selectWalletDrawerRef} />
      <SelectTokenDrawer ref={selectTokenDrawerRef} />
      <SettingsDrawer ref={settingsRef} />
    </FormContainer>
  );
};
