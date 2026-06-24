import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldActions } from '../stores/form/useFieldActions.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { useLimitOrderStore } from '../stores/limitOrder/useLimitOrderStore.js'
import { deriveLimitPrice, deriveReceiveAmount } from '../utils/limitOrder.js'
import { useToken } from './useToken.js'

export interface LinkedLimitFields {
  sendAmount: string
  receiveAmount: string
  limitPrice: string
  /** Set the send amount (explicit user edit); derives receiveAmount when a price is set. */
  setSendAmount: (value: string) => void
  /** Set the receive amount; derives limitPrice when a send amount is set. */
  setReceiveAmount: (value: string) => void
  /** Set the limit price (canonical: receive per send); derives receiveAmount when a send amount is set. */
  setLimitPrice: (value: string) => void
}

/**
 * Implements the linked-field derivation for limit orders:
 * - `limitPrice = receiveAmount / sendAmount`
 * - editing sendAmount (with a price set) recomputes receiveAmount
 * - editing receiveAmount (with a send amount set) recomputes limitPrice
 * - editing limitPrice (with a send amount set) recomputes receiveAmount
 * - sendAmount never changes without an explicit user edit
 *
 * The limit price is stored canonically as receive-per-send; the UI layer
 * handles base/quote display inversion.
 */
export const useLinkedLimitFields = (): LinkedLimitFields => {
  const { setFieldValue } = useFieldActions()
  const [toChainId, toTokenAddress, sendAmount, receiveAmount] = useFieldValues(
    FormKeyHelper.getChainKey('to'),
    FormKeyHelper.getTokenKey('to'),
    FormKeyHelper.getAmountKey('from'),
    FormKeyHelper.getAmountKey('to')
  )
  const { token: toToken } = useToken(toChainId, toTokenAddress)
  const limitPrice = useLimitOrderStore((state) => state.limitPrice)
  const setStoreLimitPrice = useLimitOrderStore((state) => state.setLimitPrice)

  const setSendAmount = (value: string): void => {
    setFieldValue('fromAmount', value, { isDirty: true, isTouched: true })
    const nextReceive = deriveReceiveAmount(
      value,
      limitPrice,
      toToken?.decimals
    )
    if (nextReceive) {
      setFieldValue('toAmount', nextReceive, { isDirty: true })
    }
  }

  const setReceiveAmount = (value: string): void => {
    setFieldValue('toAmount', value, { isDirty: true, isTouched: true })
    const nextPrice = deriveLimitPrice(sendAmount, value)
    if (nextPrice) {
      setStoreLimitPrice(nextPrice)
    }
  }

  const setLimitPrice = (value: string): void => {
    setStoreLimitPrice(value)
    const nextReceive = deriveReceiveAmount(
      sendAmount,
      value,
      toToken?.decimals
    )
    if (nextReceive) {
      setFieldValue('toAmount', nextReceive, { isDirty: true })
    }
  }

  return {
    sendAmount,
    receiveAmount,
    limitPrice,
    setSendAmount,
    setReceiveAmount,
    setLimitPrice,
  }
}
