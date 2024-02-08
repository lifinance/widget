import type {
  EVMChain,
  LiFiStep,
  Process,
  ProcessType,
  Status,
  StatusMessage,
  Substatus,
} from '@lifi/sdk';
import { LiFiErrorCode } from '@lifi/sdk';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import type { WidgetSubvariant } from '../types/widget.js';
import { formatTokenAmount } from '../utils/format.js';
import { useAvailableChains } from './useAvailableChains.js';

export const useProcessMessage = (step?: LiFiStep, process?: Process) => {
  const { subvariant } = useWidgetConfig();
  const { t } = useTranslation();
  const { getChainById } = useAvailableChains();
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
  step: LiFiStep,
  process: Process,
  subvariant?: WidgetSubvariant,
): {
  title?: string;
  message?: string;
} {
  if (process.error && process.status === 'FAILED') {
    const getDefaultErrorMessage = (key?: string) =>
      `${t((key as any) ?? 'error.message.transactionNotSent')} ${t(
        'error.message.remainInYourWallet',
        {
          amount: formatTokenAmount(
            BigInt(step.action.fromAmount),
            step.action.fromToken.decimals,
          ),
          tokenSymbol: step.action.fromToken.symbol,
          chainName: getChainById(step.action.fromChainId)?.name ?? '',
        },
      )}`;
    let title: string = '';
    let message: string = '';
    switch (process.error.code) {
      case LiFiErrorCode.AllowanceRequired:
        title = t(`error.title.allowanceRequired`);
        message = t(`error.message.allowanceRequired`, {
          tokenSymbol: step.action.fromToken.symbol,
        });
        break;
      case LiFiErrorCode.BalanceError:
        title = t(`error.title.balanceIsTooLow`);
        message = getDefaultErrorMessage();
        break;
      case LiFiErrorCode.ChainSwitchError:
        title = t(`error.title.chainSwitch`);
        message = getDefaultErrorMessage();
        break;
      case LiFiErrorCode.GasLimitError:
        title = t(`error.title.gasLimitIsTooLow`);
        message = getDefaultErrorMessage();
        break;
      case LiFiErrorCode.InsufficientFunds:
        title = t(`error.title.insufficientFunds`);
        message = `${t(
          `error.message.insufficientFunds`,
        )} ${getDefaultErrorMessage()}`;
        break;
      case LiFiErrorCode.SlippageError:
        title = t(`error.title.slippageNotMet`);
        message = t(`error.message.slippageThreshold`);
        break;
      case LiFiErrorCode.TransactionFailed:
        title = t(`error.title.transactionFailed`);
        message = t(`error.message.transactionFailed`);
        break;
      case LiFiErrorCode.TransactionUnderpriced:
        title = t(`error.title.transactionUnderpriced`);
        message = getDefaultErrorMessage();
        break;
      case LiFiErrorCode.TransactionUnprepared:
        title = t(`error.title.transactionUnprepared`);
        message = getDefaultErrorMessage();
        break;
      case LiFiErrorCode.TransactionCanceled:
        title = t(`error.title.transactionCanceled`);
        message = getDefaultErrorMessage('error.message.transactionCanceled');
        break;
      case LiFiErrorCode.ExchangeRateUpdateCanceled:
        title = t(`error.title.exchangeRateUpdateCanceled`);
        message = getDefaultErrorMessage();
        break;
      case LiFiErrorCode.SignatureRejected:
        title = t(`error.title.signatureRejected`);
        message = t(`error.message.signatureRejected`, {
          amount: formatTokenAmount(
            BigInt(step.action.fromAmount),
            step.action.fromToken.decimals,
          ),
          tokenSymbol: step.action.fromToken.symbol,
          chainName: getChainById(step.action.fromChainId)?.name ?? '',
        });
        break;
      case LiFiErrorCode.ProviderUnavailable:
      default:
        title = t(`error.title.unknown`);
        if (process.txLink) {
          message = t(`error.message.transactionFailed`);
        } else {
          message = process.error.message || t(`error.message.unknown`);
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
