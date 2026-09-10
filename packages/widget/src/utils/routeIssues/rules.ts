import type { RouteIssueBucket, RouteIssueRule } from './types.js'

export const bucketOrder: RouteIssueBucket[] = [
  'amountTooLow',
  'amountTooHigh',
  'slippageTooTight',
  'destinationAccountNotReady',
  'recipientNotSupported',
  'gaslessNotAvailable',
  'blockedBySettings',
  'liquidity',
  'temporary',
  'pairNotSupported',
]

export const routeIssueRules: RouteIssueRule[] = []
