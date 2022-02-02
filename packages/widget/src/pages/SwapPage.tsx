import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { MainHeader, WalletHeader } from '../components/Header';
import { SwapButton } from '../components/SwapButton';
import { SwapForm } from '../components/SwapForm';
import { SwapFormProvider } from '../components/SwapFormProvider';

const MainContainer = styled(Container)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const FormContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexGrow: 1,
}));

export function SwapPage() {
  const { t } = useTranslation();
  return (
    <MainContainer maxWidth="sm" disableGutters>
      <WalletHeader />
      <MainHeader />
      <SwapFormProvider>
        <FormContainer maxWidth="sm">
          <SwapForm />
        </FormContainer>
        <Box>
          <SwapButton variant="contained" disableElevation fullWidth>
            {t(`swap.button`)}
          </SwapButton>
        </Box>
      </SwapFormProvider>
    </MainContainer>
  );
}
