import { useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAddressValidation } from '../../hooks/useAddressValidation.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useBookmarkActions } from '../bookmarks/useBookmarkActions.js'
import type { FormFieldNames } from '../form/types.js'
import { useFieldActions } from '../form/useFieldActions.js'
import { useFieldValues } from '../form/useFieldValues.js'
import { useTouchedFields } from '../form/useTouchedFields.js'
import { getDefaultValuesFromQueryString } from './getDefaultValuesFromQueryString.js'

const formValueKeys: FormFieldNames[] = [
  'fromAmount',
  'fromChain',
  'fromToken',
  'toAddress',
  'toChain',
  'toToken',
]

// Limit-order params are only mirrored to the URL while the limit tab is
// active, and stripped when the user leaves it. Unlike the base keys these are
// presence-gated (not touched-gated) so the URL fully reproduces the limit
// order — including the boolean/number fields, which are never "falsy-empty".
const limitFormValueKeys: FormFieldNames[] = [
  'toAmount',
  'validUntil',
  'partiallyFillable',
]

export const URLSearchParamsBuilder = () => {
  const { pathname } = useLocation()
  const touchedFields = useTouchedFields()
  const values = useFieldValues(...formValueKeys, ...limitFormValueKeys)
  const { setSelectedBookmark, addRecentWallet } = useBookmarkActions()
  const { validateAddress } = useAddressValidation()
  const { buildUrl, mode } = useWidgetConfig()
  // Using these methods as trying to use the touchedFields and values above
  // often has a lag that can effect the widgets initialisation sequence
  // and accidentally cause values to be wiped from the query string
  const { getFieldValues, isTouched, setUserAndDefaultValues } =
    useFieldActions()

  useEffect(() => {
    // get the initial values from the querystring
    const formValues = getDefaultValuesFromQueryString({ buildUrl })
    const { toAddress, ...initialFormValues } = formValues

    /**
     * When URL builder is enabled and user opens a page with toAddress parameter,
     * validate the address and set it up as a bookmark. This allows direct linking
     * to the widget with a pre-filled destination address that will be treated the
     * same way as a manually entered and validated address.
     */
    const initializeFromAddress = async () => {
      if (toAddress) {
        try {
          const validationResult = await validateAddress({
            value: toAddress,
          })
          if (validationResult.isValid && toAddress) {
            const bookmark = {
              address: validationResult.address,
              chainType: validationResult.chainType,
            }
            setUserAndDefaultValues({ toAddress })
            setSelectedBookmark(bookmark)
            addRecentWallet(bookmark)
          }
        } catch (_) {
          // Address validation failed
        }
      }
    }

    setUserAndDefaultValues(initialFormValues)
    initializeFromAddress()
  }, [
    setUserAndDefaultValues,
    validateAddress,
    setSelectedBookmark,
    addRecentWallet,
    buildUrl,
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
    // Limit params live in the URL only while the limit tab is active.
    limitFormValueKeys.forEach((key) => {
      const value = getFieldValues(key)[0]
      // Booleans are always "set" (false is meaningful); strings/numbers use
      // truthiness so an empty toAmount is treated as absent.
      const hasValue = typeof value === 'boolean' ? true : Boolean(value)
      if (mode === 'limit' && hasValue) {
        url.searchParams.set(key, String(value))
      } else {
        url.searchParams.delete(key)
      }
    })
    url.searchParams.sort()
    window.history.replaceState(window.history.state, '', url)
  }, [pathname, touchedFields, values, isTouched, getFieldValues, mode])

  return null
}
