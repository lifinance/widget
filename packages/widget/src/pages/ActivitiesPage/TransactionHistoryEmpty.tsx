import HistoryIcon from '@mui/icons-material/History'
import { useTranslation } from 'react-i18next'
import { EmptyListIndicator } from '../../components/EmptyListIndicator/EmptyListIndicator.js'

export const TransactionHistoryEmpty: React.FC = () => {
  const { t } = useTranslation()
  return (
    <EmptyListIndicator
      icon={<HistoryIcon />}
      title={t('info.title.emptyTransactionHistory')}
      message={t('info.message.emptyTransactionHistory')}
    />
  )
}
