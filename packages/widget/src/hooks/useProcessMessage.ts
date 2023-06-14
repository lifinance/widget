import type {
  EVMChain,
  LifiStep,
  Process,
  ProcessType,
  Status,
  StatusMessage,
  Substatus,
} from '@lifi/sdk';
import { LifiErrorCode } from '@lifi/sdk';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useWidgetConfig } from '../providers';
import type { WidgetSubvariant } from '../types';
import { formatTokenAmount } from '../utils';
import { useChains } from './useChains';

export const useProcessMessage = (step?: LifiStep, process?: Process) => {
  const { subvariant } = useWidgetConfig();
  const { t } = useTranslation();
  const { getChainById } = useChains();
  if (!step || !process) {
    return {};
  }
  return getProcessMessage(t, getChainById, step, process, subvariant);
};

const processStatusMessages: Record<
  ProcessType,
  Partial<
    Record<Status, (t: TFunction, subvariant?: WidgetSubvariant) => string>
  >
> = {
  TOKEN_ALLOWANCE: {
    STARTED: (t) => t(`main.process.tokenAllowance.started`),
    ACTION_REQUIRED: (t) => t(`main.process.tokenAllowance.pending`),
    PENDING: (t) => t(`main.process.tokenAllowance.pending`),
    DONE: (t) => t(`main.process.tokenAllowance.done`),
  },
  SWITCH_CHAIN: {
    ACTION_REQUIRED: (t) => t(`main.process.switchChain.actionRequired`),
    DONE: (t) => t(`main.process.switchChain.done`),
  },
  SWAP: {
    STARTED: (t) => t(`main.process.swap.started`),
    ACTION_REQUIRED: (t) => t(`main.process.swap.actionRequired`),
    PENDING: (t) => t(`main.process.swap.pending`),
    DONE: (t, subvariant) =>
      subvariant === 'nft'
        ? t(`main.process.nft.done`)
        : t(`main.process.swap.done`),
  },
  CROSS_CHAIN: {
    STARTED: (t) => t(`main.process.crossChain.started`),
    ACTION_REQUIRED: (t) => t(`main.process.crossChain.actionRequired`),
    PENDING: (t) => t(`main.process.crossChain.pending`),
    DONE: (t) => t(`main.process.crossChain.done`),
  },
  RECEIVING_CHAIN: {
    PENDING: (t) => t(`main.process.receivingChain.pending`),
    DONE: (t, subvariant) =>
      subvariant === 'nft'
        ? t(`main.process.nft.done`)
        : t(`main.process.receivingChain.done`),
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
    PARTIAL: (t) => t(`main.process.receivingChain.partial`),
    REFUNDED: (t) => t(`main.process.receivingChain.partial`),
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
  step: LifiStep,
  process: Process,
  subvariant?: WidgetSubvariant,
): {
  title?: string;
  message?: string;
} {
  if (process.error && process.status === 'FAILED') {
    const getTransactionNotSentMessage = () =>
      t(`error.message.transactionNotSent`, {
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
      case LifiErrorCode.AllowanceRequired:
        title = t(`error.title.allowanceRequired`);
        message = t(`error.message.allowanceRequired`, {
          tokenSymbol: step.action.fromToken.symbol,
        });
        break;
      case LifiErrorCode.BalanceError:
        title = t(`error.title.balanceIsTooLow`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.ChainSwitchError:
        title = t(`error.title.chainSwitch`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.GasLimitError:
        title = t(`error.title.gasLimitIsTooLow`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.InsufficientFunds:
        title = t(`error.title.insufficientFunds`);
        message = `${t(
          `error.message.insufficientFunds`,
        )} ${getTransactionNotSentMessage()}`;
        break;
      case LifiErrorCode.SlippageError:
        title = t(`error.title.slippageNotMet`);
        message = t(`error.message.slippageThreshold`);
        break;
      case LifiErrorCode.TransactionFailed:
        title = t(`error.title.transactionFailed`);
        message = t(`error.message.transactionFailed`);
        break;
      case LifiErrorCode.TransactionUnderpriced:
        title = t(`error.title.transactionUnderpriced`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.TransactionUnprepared:
        title = t(`error.title.transactionUnprepared`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.TransactionCanceled:
        title = t(`error.title.transactionCanceled`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.TransactionRejected:
        title = t(`error.title.transactionRejected`);
        message = t(`error.message.transactionRejected`, {
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
        title = t(`error.title.unknown`);
        if (process.txLink) {
          message = t(`error.message.transactionFailed`);
        } else {
          message = t(`error.message.unknown`);
        }
        break;
    }
    return { title, message };
  }
  const title =
    processSubstatusMessages[process.status as StatusMessage]?.[
      process.substatus!
    ]?.(t) ??
    processStatusMessages[process.type]?.[process.status]?.(t, subvariant);
  return { title };
}
