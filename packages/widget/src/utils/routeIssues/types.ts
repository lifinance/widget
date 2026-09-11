export type RouteIssueBucket =
  | 'amountTooLow'
  | 'amountTooHigh'
  | 'slippageTooTight'
  | 'slippageTooLoose'
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
  /** Scaled from USD rather than read off a bridge, so an exact one wins. */
  estimated?: boolean
  requiredSlippage?: number
  minUsd?: number
  note?: string
}

export interface RouteIssue {
  bucket: RouteIssueBucket
  ruleId: string
  evidence?: RouteIssueEvidence
  /** The send amount this was raised for; the card must not read a newer one. */
  fromAmount: bigint
}

export interface ClassifyContext {
  fromAmount: bigint
  fromChainId: number
  fromTokenSymbol: string
  fromTokenDecimals: number
  fromAddress?: string
  toAddress?: string
}

export interface RouteIssueRule {
  id: string
  bucket: RouteIssueBucket
  suppressed?: boolean
  match: { code: string } | { fragment: RegExp }
  /** `null` rejects the entry; an object keeps the bucket, with or without a figure. */
  extract?: (
    match: RegExpExecArray,
    context: ClassifyContext,
    path?: string
  ) => RouteIssueEvidence | null
  bucketFrom?: (evidence: RouteIssueEvidence) => RouteIssueBucket | undefined
}
