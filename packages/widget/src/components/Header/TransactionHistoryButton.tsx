import ReceiptLong from '@mui/icons-material/ReceiptLong'
import { IconButton, Tooltip } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { navigationRoutes } from '../../utils/navigationRoutes.js'

export const TransactionHistoryButton = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Tooltip title={t('header.transactionHistory')}>
      <IconButton
        size="medium"
        onClick={() => navigate({ to: navigationRoutes.transactionHistory })}
      >
        <ReceiptLong />
      </IconButton>
    </Tooltip>
  )
}
