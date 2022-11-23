import type {
  EVMChain,
  Process,
  ProcessType,
  Status,
  StatusMessage,
  Step,
  Substatus
} from '@lifi/sdk';
import { LifiErrorCode } from '@lifi/sdk';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { formatTokenAmount } from '../utils';
import { useChains } from './useChains';

export const useProcessMessage = (step?: Step, process?: Process) => {
  const { t } = useTranslation();
  const { getChainById } = useChains();
  if (!step || !process) {
    return {};
  }
  return getProcessMessage(t, getChainById, step, process);
};

const processStatusMessages: Record<
  ProcessType,
  Partial<Record<Status, (t: TFunction) => string>>
> = {
  TOKEN_ALLOWANCE: {
    STARTED: (t) => t(`swap.process.tokenAllowance.started`),
    PENDING: (t) => t(`swap.process.tokenAllowance.pending`),
    DONE: (t) => t(`swap.process.tokenAllowance.done`),
  },
  SWITCH_CHAIN: {
    ACTION_REQUIRED: (t) => t(`swap.process.switchChain.actionRequired`),
    DONE: (t) => t(`swap.process.switchChain.done`),
  },
  SWAP: {
    STARTED: (t) => t(`swap.process.swap.started`),
    ACTION_REQUIRED: (t) => t(`swap.process.swap.actionRequired`),
    PENDING: (t) => t(`swap.process.swap.pending`),
    DONE: (t) => t(`swap.process.swap.done`),
  },
  CROSS_CHAIN: {
    STARTED: (t) => t(`swap.process.crossChain.started`),
    ACTION_REQUIRED: (t) => t(`swap.process.crossChain.actionRequired`),
    PENDING: (t) => t(`swap.process.crossChain.pending`),
    DONE: (t) => t(`swap.process.crossChain.done`),
  },
  RECEIVING_CHAIN: {
    PENDING: (t) => t(`swap.process.receivingChain.pending`),
    DONE: (t) => t(`swap.process.receivingChain.done`),
  },
  TRANSACTION: {},
};

const processSubstatusMessages: Record<
  StatusMessage,
  Partial<Record<Substatus, (t: TFunction) => string>>
> = {
  PENDING: {
    // BRIDGE_NOT_AVAILABLE: 'Bridge communication is temporarily unavailable.',
    // CHAIN_NOT_AVAILABLE: 'RPC communication is temporarily unavailable.',
    // REFUND_IN_PROGRESS:
    //   "The refund has been requested and it's being processed",
    // WAIT_DESTINATION_TRANSACTION:
    //   'The bridge off-chain logic is being executed. Wait for the transaction to appear on the destination chain.',
    // WAIT_SOURCE_CONFIRMATIONS:
    //   'The bridge deposit has been received. The bridge is waiting for more confirmations to start the off-chain logic.',
  },
  DONE: {
    // COMPLETED: 'The transfer is complete.',
    PARTIAL: (t) => t(`swap.process.receivingChain.partial`),
    REFUNDED: (t) => t(`swap.process.receivingChain.partial`),
  },
  FAILED: {
    // TODO: should be moved to failed status
    // NOT_PROCESSABLE_REFUND_NEEDED:
    //   'The transfer cannot be completed successfully. A refund operation is required.',
    // UNKNOWN_ERROR:
    //   'An unexpected error occurred. Please seek assistance in the LI.FI discord server.',
  },
  INVALID: {},
  NOT_FOUND: {},
};

export function getProcessMessage(
  t: TFunction,
  getChainById: (chainId: number) => EVMChain | undefined,
  step: Step,
  process: Process,
): {
  title?: string;
  message?: string;
} {
  if (process.error && process.status === 'FAILED') {
    const getTransactionNotSentMessage = () =>
      t(`swap.error.message.transactionNotSent`, {
        amount: formatTokenAmount(
          step.action.fromAmount,
          step.action.fromToken.decimals,
        ),
        tokenSymbol: step.action.fromToken.symbol,
        chainName: getChainById(step.action.fromChainId)?.name ?? '',
      });
    let title: string = '';
    let message: string = '';
    switch (process.error.code) {
      case LifiErrorCode.BalanceError:
        title = t(`swap.error.title.balanceIsTooLow`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.ChainSwitchError:
        title = t(`swap.error.title.chainSwitch`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.GasLimitError:
        title = t(`swap.error.title.gasLimitIsTooLow`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.TransactionFailed:
        title = t(`swap.error.title.transactionFailed`);
        message = t(`swap.error.message.transactionFailed`);
        break;
      case LifiErrorCode.TransactionUnderpriced:
        title = t(`swap.error.title.transactionUnderpriced`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.TransactionUnprepared:
        title = t(`swap.error.title.transactionUnprepared`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.TransactionCanceled:
        title = t(`swap.error.title.transactionCanceled`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.SlippageError:
        title = t(`swap.error.title.slippageNotMet`);
        message = t(`swap.error.message.slippageThreshold`);
        break;
      case LifiErrorCode.TransactionRejected:
        title = t(`swap.error.title.transactionRejected`);
        message = t(`swap.error.message.transactionRejected`, {
          amount: formatTokenAmount(
            step.action.fromAmount,
            step.action.fromToken.decimals,
          ),
          tokenSymbol: step.action.fromToken.symbol,
          chainName: getChainById(step.action.fromChainId)?.name ?? '',
        });
        break;
      case LifiErrorCode.ProviderUnavailable:
      default:
        title = t(`swap.error.title.unknown`);
        if (process.txLink) {
          message = t(`swap.error.message.transactionFailed`);
        } else {
          message = t(`swap.error.message.unknown`);
        }
        break;
    }
    return { title, message };
  }
  const title =
    processSubstatusMessages[process.status as StatusMessage]?.[
      process.substatus!
    ]?.(t) ?? processStatusMessages[process.type]?.[process.status]?.(t);
  return { title };
}
