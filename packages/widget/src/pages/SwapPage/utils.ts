import {
  EVMChain,
  LifiErrorCode,
  MetaMaskProviderErrorCode,
  Process,
  ProcessType,
  Status,
  Step,
} from '@lifinance/sdk';
import { TFunction } from 'react-i18next';
import { formatTokenAmount } from '../../utils/format';

const formatProcessMessage = (
  initialMessage: string,
  args: Record<string, string> = {},
) => {
  return Object.keys(args).reduce((message, key) => {
    return message.replace(`{${key}}`, args[key]);
  }, initialMessage);
};

const processMessages: Record<
  ProcessType,
  Partial<Record<Status, (t: TFunction<'translation', undefined>) => string>>
> = {
  TOKEN_ALLOWANCE: {
    STARTED: (t) => t(`swap.process.tokenAllowance.started`),
    PENDING: (t) => t(`swap.process.tokenAllowance.pending`),
    DONE: (t) => t(`swap.process.tokenAllowance.done`),
  },
  SWITCH_CHAIN: {
    PENDING: (t) => t(`swap.process.switchChain.pending`),
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

export function getProcessMessage(
  t: TFunction<'translation', undefined>,
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
      case LifiErrorCode.ChainSwitchError:
        title = t(`swap.error.title.chainSwitch`);
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
      case LifiErrorCode.SlippageError:
        title = t(`swap.error.title.slippageTooLarge`);
        message = t(`swap.error.message.slippageTooLarge`);
        break;
      case MetaMaskProviderErrorCode.userRejectedRequest:
        title = t(`swap.error.title.userRejectedSignatureRequest`);
        message = t(`swap.error.message.signatureRequired`, {
          amount: formatTokenAmount(
            step.action.fromAmount,
            step.action.fromToken.decimals,
          ),
          tokenSymbol: step.action.fromToken.symbol,
          chainName: getChainById(step.action.fromChainId)?.name ?? '',
        });
        break;
      default:
        title = t(`swap.error.title.unknown`);
        if (process.txLink) {
          message = t(`swap.error.message.transactionFailed`);
        }
        break;
    }
    return { title, message };
  }
  const title = processMessages[process.type][process.status]?.(t);
  return { title };
}
