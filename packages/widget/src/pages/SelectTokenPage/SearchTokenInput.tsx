import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchInput } from '../../components/Search/SearchInput.js'
import { useChainOrderStore } from '../../stores/chains/ChainOrderStore.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'

export const SearchTokenInput = () => {
  const { t } = useTranslation()
  const [value] = useFieldValues('tokenSearchFilter')
  const { setFieldValue, setAsTouched } = useFieldActions()
  const [fromChain, toChain] = useFieldValues('fromChain', 'toChain')
  const isAllNetworks = useChainOrderStore((state) => state.isAllNetworks)

  const onChange = useCallback(
    (newValue: string | number | undefined) => {
      setFieldValue('tokenSearchFilter', newValue, {
        isDirty: true,
        isTouched: true,
      })
    },
    [setFieldValue]
  )

  const onBlur = useCallback(() => {
    setAsTouched('tokenSearchFilter')
  }, [setAsTouched])

  useEffect(
    () => () => {
      setFieldValue('tokenSearchFilter', '')
    },
    [setFieldValue]
  )

  return (
    <SearchInput
      // Reset the search input when a chain or the "All Networks" is changed
      key={`${fromChain}-${toChain}-${isAllNetworks}`}
      name="tokenSearchFilter"
      placeholder={t('main.tokenSearch')}
      onChange={(e) => onChange((e.target as HTMLInputElement).value)}
      onBlur={onBlur}
      onClear={() => setFieldValue('tokenSearchFilter', '')}
      value={value as string | undefined}
      autoFocus
    />
  )
}
