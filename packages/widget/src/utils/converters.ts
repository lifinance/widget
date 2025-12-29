import type {
  Execution,
  ExecutionStatus,
  ExtendedTransactionInfo,
  FeeCost,
  FullStatusData,
  Substatus,
  TokenAmount,
  ToolsResponse,
  TransactionType,
} from '@lifi/sdk'
import type { RouteExecution } from '../stores/routes/types.js'
import { formatTokenPrice } from './format.js'

type Transaction = Execution['transactions'][number]

const buildTransactionsFromTxHistory = (
  tx: FullStatusData
): { transactions: Transaction[]; type: TransactionType } => {
  const sending = tx.sending as ExtendedTransactionInfo
  const receiving = tx.receiving as ExtendedTransactionInfo

  if (!sending.token?.chainId || !receiving.token?.chainId) {
    return { transactions: [], type: 'SWAP' }
  }

  const isSwap = sending.chainId === receiving.chainId

  if (isSwap) {
    return {
      transactions: [
        {
          type: 'SWAP',
          chainId: sending.chainId,
          txHash: sending.txHash,
          txLink: sending.txLink,
        },
      ],
      type: 'SWAP',
    }
  }

  return {
    transactions: [
      {
        type: 'CROSS_CHAIN',
        chainId: sending.chainId,
        txHash: sending.txHash,
        txLink: sending.txLink,
      },
      {
        type: 'RECEIVING_CHAIN',
        chainId: receiving.chainId,
        txHash: receiving.txHash,
        txLink: receiving.txLink,
      },
    ],
    type: 'CROSS_CHAIN',
  }
}

export const buildRouteFromTxHistory = (
  tx: FullStatusData,
  tools?: ToolsResponse
) => {
  const sending = tx.sending as ExtendedTransactionInfo
  const receiving = tx.receiving as ExtendedTransactionInfo

  if (!sending.token?.chainId || !receiving.token?.chainId) {
    return
  }

  let usedTool = tx.sending.includedSteps?.find(
    (step) => step.toolDetails.key === tx.tool
  )?.toolDetails

  if (!usedTool) {
    const selectedBridge = tools?.bridges.find(
      (bridge) => bridge.key === tx.tool
    )

    const selectedExchange = tools?.exchanges.find(
      (exchange) => exchange.key === tx.tool
    )
    usedTool = {
      key: tx.tool,
      name: selectedBridge?.name ?? selectedExchange?.name ?? tx.tool,
      logoURI: selectedBridge?.logoURI ?? selectedExchange?.logoURI ?? '',
    }
  }

  const fromToken: TokenAmount = {
    ...sending.token,
    amount: BigInt(sending.amount ?? 0),
  }

  const toToken: TokenAmount = {
    ...receiving.token,
    amount: BigInt(receiving.amount ?? 0),
  }

  const sendingValue = sending.value ? BigInt(sending.value) : 0n
  const sendingFeeAmount =
    sending.gasToken.address === sending.token.address && sending.amount
      ? sendingValue - BigInt(sending.amount)
      : sendingValue
  const sendingFeeAmountUsd =
    sending.gasToken.priceUSD && sendingFeeAmount
      ? formatTokenPrice(
          sendingFeeAmount,
          sending.gasToken.priceUSD,
          sending.gasToken.decimals
        )
      : 0

  const feeCosts: FeeCost[] | undefined = sendingFeeAmount
    ? [
        {
          amount: sendingFeeAmount.toString(),
          amountUSD: sendingFeeAmountUsd.toFixed(2),
          token: sending.gasToken,
          included: false,
          // Not used
          description: '',
          name: '',
          percentage: '',
        },
      ]
    : undefined

  const routeExecution: RouteExecution = {
    status: 1,
    route: {
      id: (tx as FullStatusData).transactionId,
      fromAddress: (tx as FullStatusData).fromAddress,
      toAddress: (tx as FullStatusData).toAddress,
      fromChainId: sending.chainId,
      fromAmount: sending.amount ?? '',
      fromAmountUSD: sending.amountUSD ?? '',
      toAmount: receiving.amount ?? '',
      toAmountMin: receiving.amount ?? '',
      toAmountUSD: receiving.amountUSD ?? '',
      toChainId: receiving.chainId,
      fromToken,
      toToken,
      gasCostUSD: sending.gasAmountUSD,
      steps: [
        {
          id: crypto.randomUUID(),
          type: 'lifi',
          tool: tx.tool,
          toolDetails: usedTool,
          action: {
            fromToken: sending.token,
            fromAmount: sending.amount ?? '',
            fromChainId: sending.chainId,
            fromAddress: (tx as FullStatusData).fromAddress,
            toToken: receiving.token,
            toChainId: receiving.chainId,
            toAddress: (tx as FullStatusData).toAddress,
            slippage: 0,
          },
          estimate: {
            tool: tx.tool,
            approvalAddress: '',
            fromAmount: sending.amount ?? '',
            fromAmountUSD: sending.amountUSD ?? '',
            toAmountMin: receiving.amount ?? '',
            toAmount: receiving.amount ?? '',
            toAmountUSD: receiving.amountUSD ?? '',
            executionDuration: 0,
          },
          includedSteps: [
            {
              id: '',
              type: sending.chainId === receiving.chainId ? 'swap' : 'cross',
              action: {
                fromChainId: sending.chainId,
                fromAmount: sending.amount ?? '',
                fromToken: sending.token,
                toChainId: receiving.chainId,
                toToken: receiving.token,
                slippage: 0,
                fromAddress: (tx as FullStatusData).fromAddress,
                toAddress: (tx as FullStatusData).toAddress,
              },
              estimate: {
                tool: tx.tool,
                fromAmount: sending.amount ?? '',
                toAmount: receiving.amount ?? '',
                toAmountMin: receiving.amount ?? '',
                approvalAddress: '',
                executionDuration: 0,
              },
              tool: tx.tool,
              toolDetails: usedTool,
            },
          ],
          integrator: tx.metadata?.integrator ?? '',
          execution: (() => {
            const { transactions, type } = buildTransactionsFromTxHistory(tx)
            const executionStatus: ExecutionStatus =
              tx.status === 'DONE' ? 'DONE' : 'FAILED'
            const substatus: Substatus =
              executionStatus === 'FAILED' ? 'UNKNOWN_ERROR' : 'COMPLETED'
            return {
              type,
              status: executionStatus,
              substatus,
              startedAt: sending.timestamp ?? Date.now(),
              doneAt: receiving.timestamp ?? Date.now(),
              transactions,
              fromAmount: sending.amount,
              toAmount: receiving.amount,
              toToken: receiving.token,
              internalTxLink: tx.lifiExplorerLink,
              externalTxLink: tx.bridgeExplorerLink,
              gasCosts: [
                {
                  amount: sending.gasAmount,
                  amountUSD: sending.gasAmountUSD,
                  token: sending.gasToken,
                  estimate: '0',
                  limit: '0',
                  price: '0',
                  type: 'SEND',
                },
              ],
              feeCosts,
            }
          })(),
        },
      ],
      insurance: {
        state: 'NOT_INSURABLE',
        feeAmountUsd: '0',
      },
    },
  }

  return routeExecution
}
