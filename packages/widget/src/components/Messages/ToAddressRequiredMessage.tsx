import Wallet from '@mui/icons-material/Wallet'
import type { BoxProps } from '@mui/material'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AlertMessage } from './AlertMessage.js'

export const ToAddressRequiredMessage: React.FC<BoxProps> = ({ ...props }) => {
  const { t } = useTranslation()
  return (
    <AlertMessage
      title={
        <Typography
          variant="body2"
          sx={{
            px: 1,
            color: 'text.primary',
          }}
        >
          {t('info.message.toAddressIsRequired')}
        </Typography>
      }
      icon={<Wallet />}
      multiline
      {...props}
    />
  )
}
