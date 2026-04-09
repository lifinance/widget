import type {
  ExecutionActionStatus,
  ExecutionActionType,
  LiFiStepExtended,
  StatusMessage,
  Substatus,
} from '@lifi/sdk'
import type { TFunction } from 'i18next'
import type { SubvariantOptions, WidgetSubvariant } from '../types/widget'

export function getActionMessage(
  t: TFunction,
  step: LiFiStepExtended,
  type: ExecutionActionType,
  status: ExecutionActionStatus,
  substatus?: Substatus,
  subvariant?: WidgetSubvariant,
  subvariantOptions?: SubvariantOptions
): {
  title?: string
  message?: string
} {
  const messageWithSubstatus = substatus
    ? actionSubstatusMessages[status as StatusMessage]?.[substatus]?.(t)
    : undefined
  const title =
    messageWithSubstatus ??
    actionStatusMessages[type]?.[status]?.(
      t,
      step,
      subvariant,
      subvariantOptions
    )
  return { title }
}

const actionStatusMessages: Record<
  ExecutionActionType,
  Partial<
    Record<
      ExecutionActionStatus,
      (
        t: TFunction,
        step: LiFiStepExtended,
        subvariant?: WidgetSubvariant,
        subvariantOptions?: SubvariantOptions
      ) => string
    >
  >
> = {
  CHECK_ALLOWANCE: {
    STARTED: (t, step) =>
      t('main.process.tokenAllowance.started', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
    PENDING: (t, step) =>
      t('main.process.tokenAllowance.pending', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
    DONE: (t, step) =>
      t('main.process.tokenAllowance.done', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
  },
  NATIVE_PERMIT: {
    STARTED: (t) => t('main.process.permit.started'),
    ACTION_REQUIRED: (t) => t('main.process.permit.actionRequired'),
    PENDING: (t) => t('main.process.permit.pending'),
    DONE: (t) => t('main.process.permit.done'),
  },
  RESET_ALLOWANCE: {
    STARTED: (t, step) =>
      t('main.process.tokenAllowance.pending', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
    RESET_REQUIRED: (t, step) =>
      t('main.process.tokenAllowance.resetRequired', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
    PENDING: (t, step) =>
      t('main.process.tokenAllowance.pending', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
    DONE: (t, step) =>
      t('main.process.tokenAllowance.pending', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
  },
  SET_ALLOWANCE: {
    STARTED: (t, step) =>
      t('main.process.tokenAllowance.pending', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
    ACTION_REQUIRED: (t, step) =>
      t('main.process.tokenAllowance.actionRequired', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
    PENDING: (t, step) =>
      t('main.process.tokenAllowance.pending', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
    DONE: (t, step) =>
      t('main.process.tokenAllowance.done', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
  },
  PERMIT: {
    STARTED: (t) => t('main.process.permit.started'),
    ACTION_REQUIRED: (t) => t('main.process.permit.actionRequired'),
    PENDING: (t) => t('main.process.permit.pending'),
    DONE: (t) => t('main.process.permit.done'),
  },
  SWAP: {
    STARTED: (t) => t('main.process.swap.started'),
    ACTION_REQUIRED: (t) => t('main.process.swap.actionRequired'),
    MESSAGE_REQUIRED: (t) => t('main.process.swap.messageRequired'),
    PENDING: (t) => t('main.process.swap.pending'),
    DONE: (t, _, subvariant, subvariantOptions) =>
      subvariant === 'custom'
        ? t(`main.process.${subvariantOptions?.custom ?? 'checkout'}.done`)
        : t('main.process.swap.done'),
  },
  CROSS_CHAIN: {
    STARTED: (t) => t('main.process.bridge.started'),
    ACTION_REQUIRED: (t) => t('main.process.bridge.actionRequired'),
    MESSAGE_REQUIRED: (t) => t('main.process.bridge.messageRequired'),
    PENDING: (t) => t('main.process.bridge.pending'),
    DONE: (t) => t('main.process.bridge.done'),
  },
  RECEIVING_CHAIN: {
    STARTED: (t) => t('main.process.receivingChain.pending'),
    PENDING: (t) => t('main.process.receivingChain.pending'),
    DONE: (t, _, subvariant, subvariantOptions) =>
      subvariant === 'custom'
        ? t(`main.process.${subvariantOptions?.custom ?? 'checkout'}.done`)
        : t('main.process.receivingChain.done'),
  },
}

const actionSubstatusMessages: Record<
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
    PARTIAL: (t) => t('main.process.receivingChain.partial'),
    REFUNDED: (t) => t('main.process.receivingChain.partial'),
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
}
