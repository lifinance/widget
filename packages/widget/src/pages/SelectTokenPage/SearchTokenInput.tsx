import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchInput } from '../../components/Search/SearchInput.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldController } from '../../stores/form/useFieldController.js'

export const SearchTokenInput = () => {
  const { t } = useTranslation()
  const { setFieldValue } = useFieldActions()
  const { onChange, onBlur, name, value } = useFieldController({
    name: 'tokenSearchFilter',
  })

  useEffect(
    () => () => {
      setFieldValue('tokenSearchFilter', '')
    },
    [setFieldValue]
  )

  return (
    <SearchInput
      name={name}
      placeholder={t('main.tokenSearch')}
      onChange={(e) => onChange((e.target as HTMLInputElement).value)}
      onBlur={onBlur}
      value={value as string | undefined}
    />
  )
}
