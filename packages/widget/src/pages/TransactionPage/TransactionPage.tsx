import { Divider, Button, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSwapRoutes } from '@lifinance/widget/hooks/useSwapRoutes';
import { useEffect, useState } from 'react';
import { Route } from '@lifinance/sdk';
import { TransactionStepper } from '../../components/TransactionStepper';
import { EmailInput } from '../../components/EmailInput';

import {
  TransactionBox,
  TransactionContainer,
  TransactionFooter,
} from './TransactionPage.style';

import { testRoutes } from './testRouteData';

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

export const TransactionPage = () => {
  const { t } = useTranslation();
  // const { routes } = useSwapRoutes();
  const [route, setRoute] = useState<Route>(testRoutes.routes[0]);

  // useEffect(() => {
  //   setRoute(testRoutes.routes[0]);
  // }, []);

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
      <TransactionBox mt={4} ml={3}>
        <TransactionStepper route={route} />
      </TransactionBox>

      <TransactionFooter maxWidth="sm" py={3}>
        <EmailNotificationFooter />
        {/* <ErrorFooter /> */}
      </TransactionFooter>
    </TransactionContainer>
  );
};
