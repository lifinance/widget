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
    STARTED: (t) => t(`swapping.process.tokenAllowance.started`),
    PENDING: (t) => t(`swapping.process.tokenAllowance.pending`),
    DONE: (t) => t(`swapping.process.tokenAllowance.done`),
  },
  SWITCH_CHAIN: {
    PENDING: (t) => t(`swapping.process.switchChain.pending`),
    DONE: (t) => t(`swapping.process.switchChain.done`),
  },
  SWAP: {
    STARTED: (t) => t(`swapping.process.swap.started`),
    ACTION_REQUIRED: (t) => t(`swapping.process.swap.actionRequired`),
    PENDING: (t) => t(`swapping.process.swap.pending`),
    DONE: (t) => t(`swapping.process.swap.done`),
  },
  CROSS_CHAIN: {
    STARTED: (t) => t(`swapping.process.crossChain.started`),
    ACTION_REQUIRED: (t) => t(`swapping.process.crossChain.actionRequired`),
    PENDING: (t) => t(`swapping.process.crossChain.pending`),
    DONE: (t) => t(`swapping.process.crossChain.done`),
  },
  RECEIVING_CHAIN: {
    PENDING: (t) => t(`swapping.process.receivingChain.pending`),
    DONE: (t) => t(`swapping.process.receivingChain.done`),
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
  if (process.error) {
    const getTransactionNotSentMessage = () =>
      t(`swapping.error.message.transactionNotSent`, {
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
        title = t(`swapping.error.title.chainSwitch`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.TransactionFailed:
        title = t(`swapping.error.title.transactionFailed`);
        message = t(`swapping.error.message.transactionFailed`);
        break;
      case LifiErrorCode.TransactionUnderpriced:
        title = t(`swapping.error.title.transactionUnderpriced`);
        message = getTransactionNotSentMessage();
        break;
      case LifiErrorCode.TransactionUnprepared:
        title = t(`swapping.error.title.transactionUnprepared`);
        message = getTransactionNotSentMessage();
        break;
      case MetaMaskProviderErrorCode.userRejectedRequest:
        title = t(`swapping.error.title.userRejectedSignatureRequest`);
        message = t(`swapping.error.message.signatureRequired`, {
          amount: formatTokenAmount(
            step.action.fromAmount,
            step.action.fromToken.decimals,
          ),
          tokenSymbol: step.action.fromToken.symbol,
          chainName: getChainById(step.action.fromChainId)?.name ?? '',
        });
        break;
      default:
        title = t(`swapping.error.title.unknown`);
        if (process.txLink) {
          message = t(`swapping.error.message.transactionFailed`);
        }
        break;
    }
    return { title, message };
  }
  const title = processMessages[process.type][process.status]?.(t);
  return { title };
}
