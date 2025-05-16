import WarningRounded from '@mui/icons-material/WarningRounded'
import { type BoxProps, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AlertMessage } from './AlertMessage.js'

export const FundsSufficiencyMessage: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation()
  return (
    <AlertMessage
      severity="warning"
      icon={<WarningRounded />}
      title={
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
          }}
        >
          {t('warning.message.insufficientFunds')}
        </Typography>
      }
      multiline
      {...props}
    />
  )
}
