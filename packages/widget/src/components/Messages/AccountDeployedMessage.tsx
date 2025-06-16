import WarningRounded from '@mui/icons-material/WarningRounded'
import type { BoxProps } from '@mui/material'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AlertMessage } from './AlertMessage.js'

export const AccountDeployedMessage: React.FC<BoxProps> = ({ ...props }) => {
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
          {t('info.message.accountDeployedMessage')}
        </Typography>
      }
      icon={<WarningRounded />}
      severity="warning"
      multiline
      {...props}
    />
  )
}
