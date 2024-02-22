import type { FullStatusData } from '@lifi/sdk';
import { ContentCopyRounded } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Card } from '../../components/Card/Card.js';
import { CardTitle } from '../../components/Card/CardTitle.js';
import { ContractComponent } from '../../components/ContractComponent/ContractComponent.js';
import { Insurance } from '../../components/Insurance/Insurance.js';
import { PageContainer } from '../../components/PageContainer.js';
import { getStepList } from '../../components/Step/StepList.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useTools } from '../../hooks/useTools.js';
import { useTransactionDetails } from '../../hooks/useTransactionDetails.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useRouteExecutionStore } from '../../stores/routes/RouteExecutionStore.js';
import { getSourceTxHash } from '../../stores/routes/utils.js';
import { buildRouteFromTxHistory } from '../../utils/converters.js';
import { formatTokenAmount } from '../../utils/format.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { ContactSupportButton } from './ContactSupportButton.js';
import { TransactionDetailsSkeleton } from './TransactionDetailsSkeleton.js';

export const TransactionDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { navigate } = useNavigateBack();
  const { subvariant, contractComponent, contractSecondaryComponent } =
    useWidgetConfig();
  const { state }: any = useLocation();
  const { tools } = useTools();
  const storedRouteExecution = useRouteExecutionStore(
    (store) => store.routes[state?.routeId],
  );

  const { transaction, isLoading } = useTransactionDetails(
    state?.transactionHash,
  );

  const routeExecution = useMemo(() => {
    if (storedRouteExecution) {
      return storedRouteExecution;
    }
    if (isLoading) {
      return;
    }
    if (transaction) {
      const routeExecution = buildRouteFromTxHistory(
        transaction as FullStatusData,
        tools,
      );
      return routeExecution;
    }
  }, [isLoading, storedRouteExecution, tools, transaction]);

  useEffect(() => {
    if (!isLoading && !routeExecution) {
      navigate(navigationRoutes.home);
    }
  }, [isLoading, navigate, routeExecution]);

  const copySupportId = async () => {
    await navigator.clipboard.writeText(supportId);
  };

  const sourceTxHash = getSourceTxHash(routeExecution?.route);

  const insuranceCoverageId = sourceTxHash ?? routeExecution?.route.fromAddress;

  let supportId = sourceTxHash ?? routeExecution?.route.id ?? '';

  if (process.env.NODE_ENV === 'development') {
    supportId += `_${routeExecution?.route.id}`;
  }

  const startedAt = new Date(
    (routeExecution?.route.steps[0].execution?.process[0].startedAt ?? 0) *
      (storedRouteExecution ? 1 : 1000), // local and BE routes have different ms handling
  );

  return isLoading && !storedRouteExecution ? (
    <TransactionDetailsSkeleton />
  ) : (
    <PageContainer topBottomGutters>
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
            BigInt(routeExecution.route.toAmountMin),
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
              <ContentCopyRounded fontSize="small" />
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
    </PageContainer>
  );
};
