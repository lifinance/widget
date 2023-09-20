import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { Card, CardTitle } from '../../components/Card';
import { ContractComponent } from '../../components/ContractComponent';
import { Dialog } from '../../components/Dialog';
import { Insurance } from '../../components/Insurance';
import { getStepList } from '../../components/Step';
import { useNavigateBack } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import {
  RouteExecution,
  useHeaderStoreContext,
  useRouteExecutionStore,
} from '../../stores';
import { formatTokenAmount } from '../../utils';
import { ContactSupportButton } from './ContactSupportButton';
import { Container } from './TransactionDetailsPage.style';
import {
  ExtendedTransactionInfo,
  FullStatusData,
  Process,
  StatusResponse,
  TokenAmount,
} from '@lifi/sdk';
import { send } from 'process';

export const TransactionDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { navigateBack } = useNavigateBack();
  const { subvariant, contractComponent, contractSecondaryComponent } =
    useWidgetConfig();
  const { state }: any = useLocation();
  // const [routeExecution, deleteRoute] = useRouteExecutionStore(
  //   (store) => [store.routes[state?.routeId], store.deleteRoute],
  //   shallow,
  // );

  const transactionHistory: StatusResponse = state?.transactionHistory;

  const routeExecution: RouteExecution = {};

  const buildRouteExecutionFromTransactionHistory = (
    txHistory: StatusResponse,
  ) => {
    const sending = txHistory.sending as ExtendedTransactionInfo;
    const receiving = txHistory.receiving as ExtendedTransactionInfo;

    if (!sending.token?.chainId || !receiving.token?.chainId) {
      return;
    }

    const fromToken: TokenAmount = {
      ...sending.token,
      amount: sending.amount ?? '0',
      priceUSD: sending.amountUSD ?? '0',
      symbol: sending.token?.symbol ?? '',
      decimals: sending.token?.decimals ?? 0,
      name: sending.token?.name ?? '',
      chainId: sending.token?.chainId,
    };

    const toToken: TokenAmount = {
      ...receiving.token,
      amount: receiving.amount ?? '0',
      priceUSD: receiving.amountUSD ?? '0',
      symbol: receiving.token?.symbol ?? '',
      decimals: receiving.token?.decimals ?? 0,
      name: receiving.token?.name ?? '',
      chainId: receiving.token?.chainId,
    };

    const routeExecution: RouteExecution = {
      route: {
        id: (txHistory as FullStatusData).transactionId,
        fromAddress: (txHistory as FullStatusData).fromAddress,
        toAddress: (txHistory as FullStatusData).toAddress,
        fromToken,
        toToken,
        steps: [
          {
            type: 'lifi',
            tool: txHistory.tool,
            toolDetails: {
              key: '1inch',
              name: '1inch',
              logoURI:
                'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/oneinch.png',
            },
            action: {
              fromToken: sending.token,
              fromAmount: sending.amount ?? '',
              toToken: receiving.token,
              fromChainId: sending.chainId,
              toChainId: receiving.chainId,
              fromAddress: (txHistory as FullStatusData).fromAddress,
              toAddress: (txHistory as FullStatusData).toAddress,
              slippage: 0,
            },
            estimate: {
              tool: txHistory.tool,
              approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              toAmountMin: '916619',
              toAmount: '921225',
              fromAmount: '100000000000000000',
              executionDuration: 30,
              fromAmountUSD: '0.92',
              toAmountUSD: '0.92',
            },
            includedSteps: [
              {
                id: 'c340c3da-03a3-4d4b-9baa-9c34e9cdb8ce',
                type: 'cross',
                action: {
                  fromChainId: sending.chainId,
                  fromAmount: sending.amount ?? '',
                  fromToken: sending.token,
                  toChainId: receiving.chainId,
                  toToken: receiving.token,
                  slippage: 0,
                  fromAddress: (txHistory as FullStatusData).fromAddress,
                  toAddress: (txHistory as FullStatusData).toAddress,
                },
                estimate: {
                  tool: txHistory.tool,
                  fromAmount: sending.amount ?? '',
                  toAmount: receiving.amount ?? '',
                  toAmountMin: receiving.amount ?? '',
                  approvalAddress: '',
                  executionDuration: 30,
                },
                tool: txHistory.tool,
                toolDetails: {
                  key: 'stargate',
                  name: 'Stargate',
                  logoURI:
                    'https://raw.githubusercontent.com/lifinance/types/5685c638772f533edad80fcb210b4bb89e30a50f/src/assets/icons/bridges/stargate.png',
                },
              },
            ],
            integrator: 'li.fi-playground',
            execution: {
              // status: txHistory.status,
              status: 'DONE',
              process: [],
              fromAmount: sending.amount,
              toAmount: receiving.amount,
              toToken: sending.token,
              gasAmount: sending.gasAmount,
              gasAmountUSD: sending.gasAmountUSD,
              gasPrice: sending.gasPrice,
              gasToken: sending.gasToken,
              gasUsed: sending.gasUsed,
            },
          },
        ],
        insurance: {
          state: 'INSURED',
          feeAmountUsd: '0',
        },
      },
    };

    return routeExecution;
  };

  const headerStoreContext = useHeaderStoreContext();
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  const handleDeleteRoute = () => {
    navigateBack();
    // if (routeExecution) {
    //   deleteRoute(routeExecution.route.id);
    // }
  };

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

  useEffect(() => {
    return headerStoreContext.getState().setAction(
      <IconButton size="medium" edge="end" onClick={toggleDialog}>
        <DeleteIcon />
      </IconButton>,
    );
  }, [headerStoreContext, toggleDialog]);

  const startedAt = new Date(
    routeExecution?.route.steps[0].execution?.process[0].startedAt ?? 0,
  );

  return (
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
          {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long' }).format(
            startedAt,
          )}
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
      <Dialog open={open} onClose={toggleDialog}>
        <DialogTitle>{t('warning.title.deleteTransaction')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('warning.message.deleteTransactionHistory')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>{t('button.cancel')}</Button>
          <Button variant="contained" onClick={handleDeleteRoute} autoFocus>
            {t('button.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
