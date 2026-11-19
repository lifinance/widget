import WarningRounded from '@mui/icons-material/WarningRounded'
import { type BoxProps, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AlertMessage } from './AlertMessage.js'

/**
 * Shown when a quote request failed (500, timeout, network error) rather than
 * confirming there is no route — distinct from `RouteNotFoundMessage` so a
 * failed request doesn't read as a confirmed absence of a route.
 */
export const QuoteFailedMessage: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation()
  return (
    <AlertMessage
      severity="warning"
      icon={<WarningRounded />}
      title={
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
          }}
        >
          {t('info.title.quoteFailed')}
        </Typography>
      }
      {...props}
    >
      <Typography
        variant="body2"
        sx={{
          px: 2,
          pt: 1,
        }}
      >
        {t('info.message.quoteFailed')}
      </Typography>
    </AlertMessage>
  )
}
