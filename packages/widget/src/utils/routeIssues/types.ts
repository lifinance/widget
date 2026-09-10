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
}

export interface RouteIssueEvidence {
  /** Which way the amount has to move. Known even when no figure is. */
  direction?: 'raise' | 'lower'
  /**
   * Both amounts in the user's own from-token, so a figure derived from them is
   * safe to show. Absent when the backend reported them in a leg token it did
   * not name.
   */
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
