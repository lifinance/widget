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
  /** A ceiling the tool stated in dollars rather than in token units. */
  maxUsd?: number
  note?: string
}

export interface RouteIssue {
  bucket: RouteIssueBucket
  ruleId: string
  evidence?: RouteIssueEvidence
  /**
   * The send amount this was raised for; the card must not read a newer one.
   * Carries the same `0n` sentinel as `ClassifyContext.fromAmount`.
   */
  fromAmount: bigint
}

export interface ClassifyContext {
  /**
   * `0n` is a sentinel, not an amount: a receive-driven quote — exact output,
   * or a contract call — is sized by what the user wants to receive, so there
   * is no send amount to reason about. Every reader must guard before treating
   * it as a number. Three separate cards have advised the wrong direction by
   * comparing a real bar against it: zero clears no floor and exceeds no
   * ceiling, so the comparison silently always answers the same way.
   */
  fromAmount: bigint
  fromChainId: number
  fromTokenSymbol: string
  fromTokenDecimals: number
  /** Tells a dust send apart from a genuinely illiquid one. */
  fromTokenPriceUSD?: string
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
