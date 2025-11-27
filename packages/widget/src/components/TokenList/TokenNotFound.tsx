import { useTranslation } from 'react-i18next'
import type { FormTypeProps } from '../../stores/form/types'
import { SearchNotFound } from '../Search/SearchNotFound'

export const TokenNotFound: React.FC<FormTypeProps> = () => {
  const { t } = useTranslation()

  return (
    <SearchNotFound message={t('info.message.emptyTokenListAllNetworks')} />
  )
}
