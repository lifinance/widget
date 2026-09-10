import type {
  RouteIssueBucket,
  RouteIssueEvidence,
  RouteIssueRule,
} from './types.js'

// A Record so a bucket missing from the order is a type error.
export const bucketRank: Record<RouteIssueBucket, number> = {
  amountTooLow: 0,
  amountTooHigh: 1,
  slippageTooTight: 2,
  liquidity: 3,
  temporary: 4,
  destinationAccountNotReady: 5,
  blockedBySettings: 6,
  gaslessNotAvailable: 7,
  // Emitted by nearly every tool that dislikes the receiver, so it drowns out
  // more specific reasons unless it sits near the catch-all.
  recipientNotSupported: 8,
  pairNotSupported: 9,
}

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
  extract: (match, context, path): RouteIssueEvidence | null => {
    const current = toBigInt(match[1])
    if (current === undefined) {
      return null
    }
    const min = toBigInt(match[2])
    const max = toBigInt(match[3])
    const belowMin = min !== undefined && current < min
    const aboveMax = max !== undefined && current > max
    // Nothing is out of range, so this reason is not about the amount.
    if (!belowMin && !aboveMax) {
      return null
    }
    // The backend reports both numbers in the unnamed bridge leg's own token,
    // so only an entry matching the user's own fromAmount yields a real figure.
    const direction = belowMin ? 'raise' : 'lower'
    const untouchedLeg = path
      ?.toLowerCase()
      .startsWith(
        `${context.fromChainId}:${context.fromTokenSymbol.toLowerCase()}-`
      )
    if (!untouchedLeg || current <= 0n || current !== context.fromAmount) {
      return { direction }
    }
    return { direction, requiredFromAmount: belowMin ? min! : max! }
  },
  bucketFrom: (evidence): RouteIssueBucket | undefined =>
    evidence.direction === 'lower'
      ? 'amountTooHigh'
      : evidence.direction === 'raise'
        ? 'amountTooLow'
        : undefined,
}

// Six decimals keeps a USD figure exact while staying in bigint.
const usdToBigInt = (value: string): bigint | undefined => {
  const scaled = Number.parseFloat(value) * 1_000_000
  if (!Number.isSafeInteger(Math.round(scaled)) || scaled <= 0) {
    return undefined
  }
  return BigInt(Math.round(scaled))
}

const fragmentRule = (
  id: string,
  bucket: RouteIssueBucket,
  fragment: RegExp,
  extract?: RouteIssueRule['extract']
): RouteIssueRule => ({ id, bucket, match: { fragment }, extract })

const codeRule = (code: string, bucket: RouteIssueBucket): RouteIssueRule => ({
  id: `code:${code}`,
  bucket,
  match: { code },
})

const suppressedFragment = (id: string, fragment: RegExp): RouteIssueRule => ({
  id,
  bucket: 'pairNotSupported',
  suppressed: true,
  match: { fragment },
})

const suppressedCode = (code: string): RouteIssueRule => ({
  id: `code:${code}`,
  bucket: 'pairNotSupported',
  suppressed: true,
  match: { code },
})

export const routeIssueRules: RouteIssueRule[] = [
  suppressedCode('TOOL_NOT_ALLOWED'),
  suppressedCode('TOOL_SPECIFIC_ERROR'),
  suppressedCode('UNKNOWN_ERROR'),
  suppressedFragment('lowVolume', /filtered due to low historical volume/),
  suppressedFragment(
    'noBridgeDefinition',
    /Could not find bridge definition for/
  ),
  suppressedFragment(
    'depositAddressSingleStep',
    /Deposit-address bridges only support single-step routes/
  ),
  suppressedFragment(
    'multipleSignatures',
    /Route requires multiple signatures/
  ),
  suppressedFragment(
    'positivePriceImpact',
    /Positive price impact too high for blue chip route/
  ),
  suppressedFragment('pureBtcMode', /pure BTC mode/),
  suppressedFragment(
    'priceImpactFilterError',
    /Price impact filtering returned with an error/
  ),

  transferRange,

  fragmentRule(
    'gaslessMinTradeSize',
    'amountTooLow',
    /the trade is worth ([\d.]+) USD, below the gasless minimum of ([\d.]+) USD/,
    (match, context) => {
      const currentUsd = usdToBigInt(match[1])
      const requiredUsd = usdToBigInt(match[2])
      // Both figures price the same request, so the USD ratio scales the
      // request's own amount exactly.
      if (
        currentUsd === undefined ||
        requiredUsd === undefined ||
        !currentUsd
      ) {
        return { direction: 'raise', minUsd: Number.parseFloat(match[2]) }
      }
      const requiredFromAmount = (context.fromAmount * requiredUsd) / currentUsd
      return {
        direction: 'raise',
        ...(requiredFromAmount > 0n && { requiredFromAmount, estimated: true }),
        minUsd: Number.parseFloat(match[2]),
      }
    }
  ),
  fragmentRule(
    'fromTokenValueFloor',
    'amountTooLow',
    /with fromToken value less than ([\d.]+) USD/,
    (match) => ({ minUsd: Number.parseFloat(match[1]) })
  ),
  fragmentRule(
    'integratorMinDestination',
    'amountTooLow',
    /Min destination amount too low for integrator \(min: ([\d.]+)\)/,
    (match) => ({ minUsd: Number.parseFloat(match[1]) })
  ),
  fragmentRule(
    'gaslessFeeExceedsInput',
    'amountTooLow',
    /GASLESS_FEE_EXCEEDS_INPUT/
  ),

  fragmentRule(
    'btcCanaryCap',
    'amountTooHigh',
    /exceeds the per-intent canary cap of/
  ),

  fragmentRule(
    'slippageTooTight',
    'slippageTooTight',
    /Path requires a slippage of ([\d.]+) but ([\d.]+) is applied/,
    (match) => {
      const required = Number.parseFloat(match[1])
      // The backend reports a fraction; anything else still sets the bucket.
      return Number.isFinite(required) && required > 0 && required < 1
        ? { requiredSlippage: required }
        : {}
    }
  ),

  fragmentRule(
    'stellarUnfunded',
    'destinationAccountNotReady',
    /Stellar receiver account is not funded/
  ),
  fragmentRule(
    'stellarTrustline',
    'destinationAccountNotReady',
    /does not have a trustline open for/
  ),
  fragmentRule(
    'stellarReserve',
    'destinationAccountNotReady',
    /XLM as its account reserve|XLM but needs/
  ),
  fragmentRule(
    'lighterAccount',
    'destinationAccountNotReady',
    /No Lighter account registered for receiver address/
  ),
  fragmentRule(
    'seiLink',
    'destinationAccountNotReady',
    /not linked to the original SEI address/
  ),
  fragmentRule(
    'solAccountRent',
    'destinationAccountNotReady',
    /SOL balance insufficient to cover temporary token account creation/
  ),

  fragmentRule(
    'contractRecipient',
    'recipientNotSupported',
    /does not send ETH to contracts|does not send WETH to EOAs|EVM contract addresses not currently supported by|EVM contract destination addresses are not currently supported by|does not support contract receivers on destination chain|Contract destination addresses which cannot receive native tokens are not supported by/
  ),
  fragmentRule(
    'multistepDifferentAddress',
    'recipientNotSupported',
    /Multistep transactions with different sending\/receiving addresses are not supported|Multistep routes from account-abstraction chains/
  ),
  fragmentRule(
    'differentRecipient',
    'recipientNotSupported',
    /Destination address different from source address is not supported/
  ),

  fragmentRule(
    'gaslessDeniedTool',
    'gaslessNotAvailable',
    /is denied for gasless requests on chain/
  ),
  fragmentRule(
    'gaslessDelegation',
    'gaslessNotAvailable',
    /carries no fromAddress, so the account type cannot be determined|gasless execution relies on EIP-7702 delegation|so it is not known whether a relayer can execute|which is not a delegate we relay for|is an undelegated EOA and chain|is a contract account on chain/
  ),
  fragmentRule(
    'gaslessNativeFee',
    'gaslessNotAvailable',
    /charges a native-token fee on top of the transferred amount/
  ),
  fragmentRule(
    'gaslessSvmSponsor',
    'gaslessNotAvailable',
    /is not supported when gasless transactions \(svmSponsor\) are requested/
  ),

  fragmentRule(
    'destinationSignature',
    'blockedBySettings',
    /requires? a signature on the destination chain, but the request did not allow it/
  ),
  fragmentRule(
    'stablecoinPreset',
    'blockedBySettings',
    /is not a stablecoin but preset requires stablecoin-only paths/
  ),
  fragmentRule(
    'executionType',
    'blockedBySettings',
    /does not match requested type/
  ),

  fragmentRule(
    'priceImpact',
    'liquidity',
    /Price impact of [\d.]+% is higher than the max allowed/
  ),

  fragmentRule(
    'toolDisabled',
    'temporary',
    /is currently disabled for this action\.\s*([\s\S]*)$/,
    (match) => {
      const note = match[1]?.trim()
      return note ? { note } : {}
    }
  ),
  fragmentRule(
    'toolNotApplied',
    'temporary',
    /Tool .+ not applied\.\s*([\s\S]*)$/,
    (match) => {
      const note = match[1]?.trim()
      return note ? { note } : {}
    }
  ),
  fragmentRule(
    'routeTimingTimeout',
    'temporary',
    /The route estimation did not complete before the route timing strategy stopped waiting for results/
  ),
  fragmentRule('podOverloaded', 'temporary', /Pod is currently overloaded\./),

  fragmentRule(
    'tronSameChain',
    'pairNotSupported',
    /Same-chain operations on Tron are not yet supported/
  ),
  fragmentRule(
    'solWrap',
    'pairNotSupported',
    /wSOL\/SOL wrap\/unwrap operations are not supported/
  ),
  fragmentRule(
    'implicitSourceSwap',
    'pairNotSupported',
    /Implicit source swaps are currently not supported for non-EVM chains/
  ),
  fragmentRule(
    'gnosisDai',
    'pairNotSupported',
    /This DAI representation is denied as destination token on gnosis chain\./
  ),
  fragmentRule(
    'rwaBlocked',
    'pairNotSupported',
    /Path contains RWA token\(s\) and integrator policy blocks RWA/
  ),
  fragmentRule(
    'acrossSwapUsdcSolana',
    'pairNotSupported',
    /acrossSwap is limited to USDC on Solana/
  ),

  codeRule('AMOUNT_TOO_LOW', 'amountTooLow'),
  codeRule('FEES_HIGHER_THAN_AMOUNT', 'amountTooLow'),
  codeRule('AMOUNT_TOO_HIGH', 'amountTooHigh'),
  codeRule('CANNOT_GUARANTEE_MIN_AMOUNT', 'slippageTooTight'),
  codeRule('DIFFERENT_RECIPIENT_NOT_SUPPORTED', 'recipientNotSupported'),
  codeRule('INSUFFICIENT_LIQUIDITY', 'liquidity'),
  codeRule('PRICE_IMPACT_TOO_HIGH', 'liquidity'),
  codeRule('RATE_LIMIT_EXCEEDED', 'temporary'),
  codeRule('TOOL_TIMEOUT', 'temporary'),
  codeRule('RPC_ERROR', 'temporary'),
  codeRule('NO_POSSIBLE_ROUTE', 'pairNotSupported'),
]
