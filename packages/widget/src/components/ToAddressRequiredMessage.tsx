import type { Route } from '@lifi/sdk'
import { Wallet } from '@mui/icons-material'
import type { BoxProps } from '@mui/material'
import { Box, Collapse, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useToAddressRequirements } from '../hooks/useToAddressRequirements.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { AlertMessage } from './AlertMessage/AlertMessage.js'

interface ToAddressRequiredMessageProps extends BoxProps {
  route?: Route
}

export const ToAddressRequiredMessage: React.FC<
  ToAddressRequiredMessageProps
> = ({ route, ...props }) => {
  const { t } = useTranslation()
  const [toAddress] = useFieldValues('toAddress')
  const { requiredToAddress } = useToAddressRequirements()

  const showMessage = route && requiredToAddress && !toAddress

  return (
    <Collapse timeout={225} in={showMessage} unmountOnExit mountOnEnter>
      <Box {...props}>
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
        />
      </Box>
    </Collapse>
  )
}
