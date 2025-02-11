import type { Route } from '@lifi/sdk'
import type { BoxProps } from '@mui/material'
import { Collapse } from '@mui/material'
import { AccountNotDeployedMessage } from './AccountNotDeployedMessage.js'
import { FundsSufficiencyMessage } from './FundsSufficiencyMessage.js'
import { GasSufficiencyMessage } from './GasSufficiencyMessage.js'
import { ToAddressRequiredMessage } from './ToAddressRequiredMessage.js'
import { useMessageQueue } from './useMessageQueue.js'

type WarningMessagesProps = BoxProps & {
  route?: Route
}

export const WarningMessages: React.FC<WarningMessagesProps> = ({
  route,
  ...props
}) => {
  const { currentMessage, hasMessages } = useMessageQueue(route)

  const getMessage = () => {
    switch (currentMessage?.id) {
      case 'INSUFFICIENT_FUNDS':
        return <FundsSufficiencyMessage {...props} />
      case 'INSUFFICIENT_GAS':
        return (
          <GasSufficiencyMessage
            insufficientGas={currentMessage.props?.insufficientGas}
            {...props}
          />
        )
      case 'ACCOUNT_NOT_DEPLOYED':
        return <AccountNotDeployedMessage {...props} />
      case 'TO_ADDRESS_REQUIRED':
        return <ToAddressRequiredMessage {...props} />
      default:
        return null
    }
  }

  return (
    <Collapse in={hasMessages} timeout={225} unmountOnExit mountOnEnter>
      {getMessage()}
    </Collapse>
  )
}
