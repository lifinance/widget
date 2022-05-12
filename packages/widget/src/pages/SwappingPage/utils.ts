import { ProcessType, Status } from '@lifinance/sdk';

const formatProcessMessage = (
  initialMessage: string,
  args: Record<string, string> = {},
) => {
  return Object.keys(args).reduce((message, key) => {
    return message.replace(`{${key}}`, args[key]);
  }, initialMessage);
};

const processMessages: Record<ProcessType, Partial<Record<Status, string>>> = {
  TOKEN_ALLOWANCE: {
    STARTED: 'Setting token allowance.',
    PENDING: 'Waiting for token allowance approval.',
    DONE: 'Token allowance approved.',
  },
  SWITCH_CHAIN: {
    PENDING: 'Chain switch required.',
    DONE: 'Chain switched successfully.',
  },
  SWAP: {
    STARTED: 'Preparing swap.',
    ACTION_REQUIRED: 'Please sign the transaction.',
    PENDING: 'Swapping.',
    DONE: 'Swap completed.',
  },
  CROSS_CHAIN: {
    STARTED: 'Preparing transaction.',
    ACTION_REQUIRED: 'Please sign the transaction.',
    PENDING: 'Waiting for transaction.',
    DONE: 'Transaction approved.',
  },
  RECEIVING_CHAIN: {
    PENDING: 'Waiting for receiving chain.',
    DONE: 'Funds received.',
  },
  TRANSACTION: {},
};

export function getProcessMessage(
  type: ProcessType,
  status: Status,
): string | undefined {
  const processMessage = processMessages[type][status];
  return processMessage;
}
