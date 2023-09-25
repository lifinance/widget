import type {
  ExtendedTransactionInfo,
  FullStatusData,
  Process,
  Status,
  StatusResponse,
  Substatus,
  TokenAmount,
} from '@lifi/sdk';
import type { RouteExecution } from '../stores';
import type { ToolsResponse } from '@lifi/sdk';

const buildProcessFromTxHistory = (txHistory: StatusResponse): Process[] => {
  const sending = txHistory.sending as ExtendedTransactionInfo;
  const receiving = txHistory.receiving as ExtendedTransactionInfo;

  if (!sending.token?.chainId || !receiving.token?.chainId) {
    return [];
  }

  const processStatus: Status = txHistory.status === 'DONE' ? 'DONE' : 'FAILED';
  const substatus: Substatus =
    processStatus === 'FAILED' ? 'UNKNOWN_ERROR' : 'COMPLETED';

  if (sending.chainId === receiving.chainId) {
    return [
      {
        type: 'SWAP', // operations on same chain will be swaps
        startedAt: sending.timestamp ?? Date.now(),
        message:
          processStatus === 'FAILED' ? 'Swap failed.' : 'Swap completed.',
        status: processStatus,
        txHash: sending.txHash,
        txLink: sending.txLink,
        doneAt: receiving.timestamp ?? Date.now(),
        substatus,
        substatusMessage: 'The transfer is complete.',
      },
    ];
  }

  const crossChainMessage: string =
    processStatus === 'FAILED'
      ? 'Bridge transfer failed.'
      : 'Bridge transfer completed.';

  const receivingChainMessage: string =
    processStatus === 'FAILED'
      ? 'Bridge transfer failed.'
      : 'Bridge transfer completed.';

  const process: Process[] = [
    {
      type: 'CROSS_CHAIN', // first step of bridging, ignoring the approvals
      startedAt: sending.timestamp ?? Date.now(),
      message: crossChainMessage,
      status: processStatus, // can be FAILED
      txHash: sending.txHash,
      txLink: sending.txLink,
      doneAt: sending.timestamp,
    },
    {
      type: 'RECEIVING_CHAIN', // final step of bridging, post swaps
      startedAt: receiving.timestamp ?? Date.now(),
      message: receivingChainMessage,
      status: processStatus,
      substatus,
      substatusMessage: 'The transfer is complete.',
      doneAt: receiving.timestamp ?? Date.now(),
      txHash: receiving.txHash,
      txLink: receiving.txLink,
    },
  ];

  return process;
};

export const buildRouteFromTxHistory = (
  txHistory: StatusResponse,
  tools?: ToolsResponse,
) => {
  const sending = txHistory.sending as ExtendedTransactionInfo;
  const receiving = txHistory.receiving as ExtendedTransactionInfo;

  if (!sending.token?.chainId || !receiving.token?.chainId) {
    return;
  }

  const selectedBridge = tools?.bridges.find(
    (bridge) => bridge.key === txHistory.tool,
  );

  const selectedExchange = tools?.exchanges.find(
    (exchange) => exchange.key === txHistory.tool,
  );

  const usedTool = {
    key: txHistory.tool,
    name: selectedBridge?.name ?? selectedExchange?.name ?? '',
    logoURI: selectedBridge?.logoURI ?? selectedExchange?.logoURI ?? '',
  };

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
    status: 1,
    route: {
      id: (txHistory as FullStatusData).transactionId,
      fromAddress: (txHistory as FullStatusData).fromAddress,
      toAddress: (txHistory as FullStatusData).toAddress,
      fromChainId: sending.chainId,
      fromAmount: sending.amount ?? '',
      fromAmountUSD: sending.amountUSD ?? '',
      toAmount: receiving.amount ?? '',
      toAmountMin: receiving.amount ?? '',
      toAmountUSD: receiving.amountUSD ?? '',
      toChainId: receiving.chainId,
      fromToken,
      toToken,
      steps: [
        {
          id: '',
          type: 'lifi',
          tool: txHistory.tool,
          toolDetails: usedTool,
          action: {
            fromToken: sending.token,
            fromAmount: sending.amount ?? '',
            fromChainId: sending.chainId,
            fromAddress: (txHistory as FullStatusData).fromAddress,
            toToken: receiving.token,
            toChainId: receiving.chainId,
            toAddress: (txHistory as FullStatusData).toAddress,
            slippage: 0,
          },
          estimate: {
            tool: txHistory.tool,
            approvalAddress: '',
            fromAmount: sending.amount ?? '',
            fromAmountUSD: sending.amountUSD ?? '',
            toAmountMin: receiving.amount ?? '',
            toAmount: receiving.amount ?? '',
            toAmountUSD: receiving.amountUSD ?? '',
            executionDuration: 30,
          },
          includedSteps: [
            {
              id: '',
              type: 'cross', // not considered to show history
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
              toolDetails: usedTool,
            },
          ],
          integrator: '',
          execution: {
            status: 'DONE', // can be FAILED
            process: buildProcessFromTxHistory(txHistory),
            fromAmount: sending.amount,
            toAmount: receiving.amount,
            toToken: receiving.token,
            gasAmount: sending.gasAmount,
            gasAmountUSD: sending.gasAmountUSD,
            gasPrice: sending.gasPrice,
            gasToken: sending.gasToken,
            gasUsed: sending.gasUsed,
          },
        },
      ],
      insurance: {
        state: 'NOT_INSURABLE',
        feeAmountUsd: '0',
      },
    },
  };

  return routeExecution;
};
