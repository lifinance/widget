import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';
import { Box, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Card, CardTitle } from '../../components/Card';
import { ContractComponent } from '../../components/ContractComponent';
import { Insurance } from '../../components/Insurance';
import { getStepList } from '../../components/Step';
import { useNavigateBack, useTools, useTransactionHistory } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import type { RouteExecution } from '../../stores';
import { formatTokenAmount, navigationRoutes } from '../../utils';
import { ContactSupportButton } from './ContactSupportButton';
import { Container } from './TransactionDetailsPage.style';
import type { StatusResponse } from '@lifi/sdk';
import {
  buildRouteFromTxHistory,
  findTxHistoryByIdOrHash,
} from '../../utils/converters';
import { TransactionDetailsSkeleton } from './TransactionDetailsSkeleton';

export const TransactionDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { subvariant, contractComponent, contractSecondaryComponent } =
    useWidgetConfig();
  const { state }: any = useLocation();

  const { tools } = useTools();

  const transactionHistoryId: string = state?.transactionHistoryId;
  const transactionHashes: string[] = state?.transactionHashes;

  const { navigate } = useNavigateBack();
  const { data, isLoading, refetch } = useTransactionHistory(transactionHashes);

  const [routeExecution, setRouteExecution] = useState<RouteExecution | null>(
    null,
  );

  const sourceTxHash = routeExecution?.route.steps[0].execution?.process
    .filter((process) => process.type !== 'TOKEN_ALLOWANCE')
    .find((process) => process.txHash)?.txHash;

  const insuranceCoverageId = sourceTxHash ?? routeExecution?.route.fromAddress;

  let supportId = sourceTxHash ?? routeExecution?.route.id ?? '';

  if (process.env.NODE_ENV === 'development') {
    supportId += `_${routeExecution?.route.id}`;
  }

  const copySupportId = async () => {
    await navigator.clipboard.writeText(supportId);
  };

  const handleRouteSetting = async (retry = 1) => {
    if (isLoading) {
      // this will be triggered again once isloading updates
      return;
    }

    const transactionHistory: StatusResponse | undefined =
      findTxHistoryByIdOrHash(data, transactionHistoryId, transactionHashes);

    if (retry < 0) {
      navigate(navigationRoutes.home);
      return;
    }

    if (!transactionHistory) {
      refetch();
      handleRouteSetting(retry - 1);
      return;
    }

    const routeExecution = buildRouteFromTxHistory(transactionHistory, tools);

    if (routeExecution) {
      setRouteExecution(routeExecution);
    }
  };

  useEffect(() => {
    handleRouteSetting();
  }, [data.length, isLoading]);

  const startedAt = new Date(
    (routeExecution?.route.steps[0].execution?.process[0].startedAt ?? 0) *
      1000,
  );

  return (
    <>
      {isLoading ? (
        <TransactionDetailsSkeleton />
      ) : (
        <Container>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
            }}
            pb={1}
          >
            <Typography fontSize={12}>
              {new Intl.DateTimeFormat(i18n.language, {
                dateStyle: 'long',
              }).format(startedAt)}
            </Typography>
            <Typography fontSize={12}>
              {new Intl.DateTimeFormat(i18n.language, {
                timeStyle: 'short',
              }).format(startedAt)}
            </Typography>
          </Box>
          {getStepList(routeExecution?.route, subvariant)}
          {subvariant === 'nft' ? (
            <ContractComponent mt={2}>
              {contractSecondaryComponent || contractComponent}
            </ContractComponent>
          ) : null}
          {routeExecution?.route?.insurance?.state === 'INSURED' ? (
            <Insurance
              mt={2}
              status={routeExecution.status}
              feeAmountUsd={routeExecution.route.insurance.feeAmountUsd}
              insuredAmount={formatTokenAmount(
                routeExecution.route.toAmountMin,
                routeExecution.route.toToken.decimals,
              )}
              insuredTokenSymbol={routeExecution.route.toToken.symbol}
              insurableRouteId={routeExecution.route.id}
              insuranceCoverageId={insuranceCoverageId}
            />
          ) : null}
          <Card mt={2}>
            <Box
              sx={{
                display: 'flex',
                flex: 1,
              }}
            >
              <CardTitle flex={1}>{t('main.supportId')}</CardTitle>
              <Box mr={1} mt={1}>
                <IconButton size="medium" onClick={copySupportId}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Typography
              variant="body2"
              pt={1}
              pb={2}
              px={2}
              sx={{ wordBreak: 'break-all' }}
            >
              {supportId}
            </Typography>
          </Card>
          <Box mt={2}>
            <ContactSupportButton supportId={supportId} />
          </Box>
        </Container>
      )}
    </>
  );
};
