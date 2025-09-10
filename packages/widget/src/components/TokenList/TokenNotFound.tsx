import { useTranslation } from 'react-i18next'
import type { FormTypeProps } from '../../stores/form/types.js'
import { SearchNotFound } from '../Search/SearchNotFound.js'

export const TokenNotFound: React.FC<FormTypeProps> = () => {
  const { t } = useTranslation()

  return (
    <SearchNotFound message={t('info.message.emptyTokenListAllNetworks')} />
  )
}
