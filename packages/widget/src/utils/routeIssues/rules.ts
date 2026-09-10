import type {
  RouteIssueBucket,
  RouteIssueEvidence,
  RouteIssueRule,
} from './types.js'

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

const integerPattern = /^\d+$/

const toBigInt = (value: string): bigint | undefined =>
  integerPattern.test(value) ? BigInt(value) : undefined

const transferRange: RouteIssueRule = {
  id: 'transferRange',
  bucket: 'amountTooLow',
  match: {
    fragment:
      /Transferred amount \(([^)]+)\) out of acceptable range \(min: ([^,]+), max: ([^)]+)\)/,
  },
  extract: (match): RouteIssueEvidence | undefined => {
    const current = toBigInt(match[1])
    if (current === undefined) {
      return undefined
    }
    const min = toBigInt(match[2])
    if (min !== undefined && current < min) {
      return { amountBounds: { current, required: min, direction: 'raise' } }
    }
    const max = toBigInt(match[3])
    if (max !== undefined && current > max) {
      return { amountBounds: { current, required: max, direction: 'lower' } }
    }
    return undefined
  },
  bucketFrom: (evidence): RouteIssueBucket | undefined =>
    evidence.amountBounds?.direction === 'lower'
      ? 'amountTooHigh'
      : evidence.amountBounds?.direction === 'raise'
        ? 'amountTooLow'
        : undefined,
}

export const routeIssueRules: RouteIssueRule[] = [transferRange]
