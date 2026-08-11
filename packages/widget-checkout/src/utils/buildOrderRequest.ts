import type { CreateFundingOrderRequest } from '@lifi/sdk'

interface Destination {
  toChainId: number
  toTokenAddress: string
  toAddress: string
}

export function buildStandardOrderRequest(
  args: Destination & {
    fromChainId: number
    fromTokenAddress: string
    fromAmount: string
    fromAddress: string
  }
): CreateFundingOrderRequest {
  return {
    partnerOrderId: crypto.randomUUID(),
    type: 'STANDARD',
    toChainId: args.toChainId,
    toTokenAddress: args.toTokenAddress,
    toAddress: args.toAddress,
    fromChainId: args.fromChainId,
    fromTokenAddress: args.fromTokenAddress,
    fromAmount: args.fromAmount,
    fromAddress: args.fromAddress,
  }
}

export function buildSmartDepositOrderRequest(
  args: Destination & {
    fromChainId: number
    fromTokenAddress: string
    fromAmount: string
  }
): CreateFundingOrderRequest {
  return {
    partnerOrderId: crypto.randomUUID(),
    type: 'SMART_DEPOSIT',
    toChainId: args.toChainId,
    toTokenAddress: args.toTokenAddress,
    toAddress: args.toAddress,
    fromChainId: args.fromChainId,
    fromTokenAddress: args.fromTokenAddress,
    fromAmount: args.fromAmount,
    // V1: refunds return to the user's receiving address.
    refundAddress: args.toAddress,
  }
}

export function buildOnrampOrderRequest(
  args: Destination & {
    fiatAmount: string
    fiatCurrency: string
    paymentMethod?: string
    countryCode?: string
  }
): CreateFundingOrderRequest {
  return {
    partnerOrderId: crypto.randomUUID(),
    type: 'ONRAMP',
    toChainId: args.toChainId,
    toTokenAddress: args.toTokenAddress,
    toAddress: args.toAddress,
    fiatAmount: args.fiatAmount,
    fiatCurrency: args.fiatCurrency,
    paymentMethod: args.paymentMethod,
    countryCode: args.countryCode,
    refundAddress: args.toAddress,
  }
}
