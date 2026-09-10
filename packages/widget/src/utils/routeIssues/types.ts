export type RouteIssueBucket =
  | 'amountTooLow'
  | 'amountTooHigh'
  | 'slippageTooTight'
  | 'destinationAccountNotReady'
  | 'recipientNotSupported'
  | 'gaslessNotAvailable'
  | 'blockedBySettings'
  | 'liquidity'
  | 'temporary'
  | 'pairNotSupported'

export interface RouteIssueAmountBounds {
  current: bigint
  required: bigint
  direction: 'raise' | 'lower'
}

export interface RouteIssueEvidence {
  amountBounds?: RouteIssueAmountBounds
  requiredSlippage?: number
  minUsd?: number
  note?: string
}

export interface RouteIssue {
  bucket: RouteIssueBucket
  ruleId: string
  count: number
  evidence?: RouteIssueEvidence
}

export interface ClassifyContext {
  fromAmount: bigint
  fromTokenDecimals: number
  fromTokenPriceUSD?: string
}

export interface RouteIssueRule {
  id: string
  bucket: RouteIssueBucket
  suppressed?: boolean
  match: { code: string } | { fragment: RegExp }
  extract?: (
    match: RegExpExecArray,
    context: ClassifyContext
  ) => RouteIssueEvidence | undefined
  bucketFrom?: (evidence: RouteIssueEvidence) => RouteIssueBucket | undefined
}
