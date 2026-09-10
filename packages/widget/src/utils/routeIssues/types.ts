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

export interface RouteIssueEvidence {
  direction?: 'raise' | 'lower'
  /**
   * The amount to aim for, in the from-token's raw units. Resolved here against
   * the amount the query used, so it never drifts with the live form field.
   */
  requiredFromAmount?: bigint
  requiredSlippage?: number
  minUsd?: number
  note?: string
}

export interface RouteIssue {
  bucket: RouteIssueBucket
  ruleId: string
  evidence?: RouteIssueEvidence
}

export interface ClassifyContext {
  fromAmount: bigint
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
