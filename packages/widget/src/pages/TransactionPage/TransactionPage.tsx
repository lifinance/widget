import { useSwapExecutionContext } from '@lifinance/widget/providers/SwapExecutionProvider';
import { Box, Button, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { EmailInput } from '../../components/EmailInput';
import { TransactionStepper } from '../../components/TransactionStepper';
import {
  GrowableTransactionBox,
  TransactionBox,
  TransactionContainer,
  TransactionFooter
} from './TransactionPage.style';
import { TransactionPageProps } from './types';

export const TransactionPage: React.FC<TransactionPageProps> = () => {
  const { t } = useTranslation();
  const { route } = useSwapExecutionContext();

  return (
    <TransactionContainer maxWidth="sm" disableGutters>
      <TransactionBox>
        <Typography
          variant="h4"
          noWrap
          sx={{ flexGrow: 1, fontWeight: 'bold' }}
          mt={3}
          mb={1}
        >
          {t(`transaction.statusHeader.paused`)}
        </Typography>
        <Typography variant="body2" pb={3}>
          {t(`transaction.statusSubText.paused`)}
        </Typography>
        <Divider light />
      </TransactionBox>
      <GrowableTransactionBox pt={4} pl={3}>
        {route ? <TransactionStepper route={route} /> : null}
      </GrowableTransactionBox>

      <TransactionFooter maxWidth="sm" py={3}>
        {/* <EmailNotificationFooter /> */}
        {/* <ErrorFooter /> */}
      </TransactionFooter>
    </TransactionContainer>
  );
};

const EmailNotificationFooter = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="body1" p={3} style={{ wordWrap: 'break-word' }}>
        {t(`transaction.footer.emailForm.informText`)}
      </Typography>
      <EmailInput />
    </>
  );
};

const ErrorFooter = () => {
  const { t } = useTranslation();
  return (
    <Box
      px={3}
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Button sx={{ minWidth: 200 }} size="large" variant="contained">
        {t(`transaction.footer.error.tryAgain`)}
      </Button>
      <Button sx={{ minWidth: 144 }} size="large" variant="contained">
        {t(`transaction.footer.error.support`)}
      </Button>
    </Box>
  );
};
