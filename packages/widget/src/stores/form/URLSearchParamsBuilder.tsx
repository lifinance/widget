import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAddressValidation } from '../../hooks/useAddressValidation.js'
import { useSendToWalletActions } from '../../stores/settings/useSendToWalletStore.js'
import { formatInputAmount } from '../../utils/format.js'
import { useBookmarkActions } from '../bookmarks/useBookmarkActions.js'
import type { DefaultValues, FormFieldNames } from '../form/types.js'
import { useFieldActions } from '../form/useFieldActions.js'
import { useFieldValues } from '../form/useFieldValues.js'
import { useTouchedFields } from '../form/useTouchedFields.js'

const formValueKeys: FormFieldNames[] = [
  'fromAmount',
  'fromChain',
  'fromToken',
  'toAddress',
  'toChain',
  'toToken',
]

const getDefaultValuesFromQueryString = (): Partial<DefaultValues> => {
  const searchParams = Object.fromEntries(
    new URLSearchParams(window?.location.search)
  )

  // Prevent using fromToken/toToken params if chain is not selected
  ;['from', 'to'].forEach((key) => {
    if (searchParams[`${key}Token`] && !searchParams[`${key}Chain`]) {
      delete searchParams[`${key}Token`]
    }
  })

  return {
    ...(Number.isFinite(Number.parseInt(searchParams.fromChain, 10))
      ? { fromChain: Number.parseInt(searchParams.fromChain, 10) }
      : {}),
    ...(Number.isFinite(Number.parseInt(searchParams.toChain, 10))
      ? { toChain: Number.parseInt(searchParams.toChain, 10) }
      : {}),
    ...(searchParams.fromToken ? { fromToken: searchParams.fromToken } : {}),
    ...(searchParams.toToken ? { toToken: searchParams.toToken } : {}),
    ...(Number.isFinite(Number.parseFloat(searchParams.fromAmount))
      ? { fromAmount: formatInputAmount(searchParams.fromAmount) }
      : {}),
    ...(searchParams.toAddress ? { toAddress: searchParams.toAddress } : {}),
  }
}

export const URLSearchParamsBuilder = () => {
  const { pathname } = useLocation()
  const touchedFields = useTouchedFields()
  const values = useFieldValues(...formValueKeys)
  const { setSendToWallet } = useSendToWalletActions()
  const { setSelectedBookmark, addRecentWallet } = useBookmarkActions()
  const { validateAddress } = useAddressValidation()

  // Using these methods as trying to use the touchedFields and values above
  // often has a lag that can effect the widgets initialisation sequence
  // and accidentally cause values to be wiped from the query string
  const { getFieldValues, isTouched, setUserAndDefaultValues } =
    useFieldActions()

  useEffect(() => {
    // get the initial values from the querystring
    const formValues = getDefaultValuesFromQueryString()

    /**
     * When URL builder is enabled and user opens a page with toAddress parameter,
     * validate the address and set it up as a bookmark. This allows direct linking
     * to the widget with a pre-filled destination address that will be treated the
     * same way as a manually entered and validated address.
     */
    const initializeFromAddress = async () => {
      if (formValues.toAddress) {
        try {
          const validationResult = await validateAddress({
            value: formValues.toAddress,
          })
          // Check if the toAddress is still in the query string
          // Could be modified by the user before the validation is done
          const { toAddress } = getDefaultValuesFromQueryString()
          if (validationResult.isValid && toAddress) {
            const bookmark = {
              address: validationResult.address,
              chainType: validationResult.chainType,
            }
            setSelectedBookmark(bookmark)
            addRecentWallet(bookmark)
            setSendToWallet(true)
          }
        } catch (_) {
          // Address validation failed
        }
      }
    }

    initializeFromAddress()
    setUserAndDefaultValues(formValues)
  }, [
    setUserAndDefaultValues,
    setSendToWallet,
    validateAddress,
    setSelectedBookmark,
    addRecentWallet,
  ])

  // biome-ignore lint/correctness/useExhaustiveDependencies: run only when pathname changes
  useEffect(() => {
    // set the values on the querysting
    const url = new URL(window.location as any)
    formValueKeys.forEach((key, _index) => {
      const value = getFieldValues(key)[0]
      if (isTouched(key) && value) {
        url.searchParams.set(key, value.toString())
      } else if (url.searchParams.has(key) && !value) {
        url.searchParams.delete(key)
      }
    })
    url.searchParams.sort()
    window.history.replaceState(window.history.state, '', url)
  }, [pathname, touchedFields, values, isTouched, getFieldValues])

  return null
}
