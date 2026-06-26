import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldActions } from '../stores/form/useFieldActions.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
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
 * - editing sendAmount recomputes receiveAmount, holding the current price
 * - editing receiveAmount recomputes the (derived) limitPrice
 * - editing limitPrice (with a send amount set) recomputes receiveAmount
 * - sendAmount never changes without an explicit user edit
 *
 * The limit price is NOT stored: it is purely a function of the `fromAmount`
 * and `toAmount` form fields (canonical receive-per-send). The UI layer handles
 * base/quote display inversion. Because it's derived, editing the receive
 * amount needs no extra write, and editing the send amount only has to preserve
 * the pre-edit price.
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

  const limitPrice = deriveLimitPrice(sendAmount, receiveAmount)

  const setSendAmount = (value: string): void => {
    // Hold the pre-edit price (derived from the current fields) so changing the
    // send amount rescales the receive amount instead of moving the price.
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
    // limitPrice re-derives from the new toAmount automatically.
    setFieldValue('toAmount', value, { isDirty: true, isTouched: true })
  }

  const setLimitPrice = (value: string): void => {
    // Write unconditionally (including '') so the receive amount tracks the
    // price both ways — clearing the price clears the derived receive amount
    // instead of leaving a stale value that re-derives the old price.
    const nextReceive = deriveReceiveAmount(
      sendAmount,
      value,
      toToken?.decimals
    )
    setFieldValue('toAmount', nextReceive, { isDirty: true })
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
