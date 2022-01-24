import { Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SwapButton } from '../components/SwapButton';

export function SwapPage() {
  const { t } = useTranslation();
  return (
    <Container maxWidth="sm" sx={{ height: '100%' }}>
      <Box>{t(`swap.header`)}</Box>
      <Box>
        <SwapButton variant="contained" disableElevation fullWidth>
          {t(`swap.button`)}
        </SwapButton>
      </Box>
    </Container>
  );
}
