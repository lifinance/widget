import type { Route } from '@lifi/sdk'
import type { BoxProps } from '@mui/material'
import { Collapse } from '@mui/material'
import { AccountDeployedMessage } from './AccountDeployedMessage'
import { AccountNotDeployedMessage } from './AccountNotDeployedMessage'
import { FundsSufficiencyMessage } from './FundsSufficiencyMessage'
import { GasSufficiencyMessage } from './GasSufficiencyMessage'
import { MinFromAmountUSDMessage } from './MinFromAmountUSDMessage'
import { MissingRouteRequiredAccountMessage } from './MissingRouteRequiredAccountMessage'
import { ToAddressRequiredMessage } from './ToAddressRequiredMessage'
import { useMessageQueue } from './useMessageQueue'

type WarningMessagesProps = BoxProps & {
  route?: Route
  allowInteraction?: boolean
}

export const WarningMessages: React.FC<WarningMessagesProps> = ({
  route,
  allowInteraction,
  ...props
}) => {
  const { messages, hasMessages } = useMessageQueue(route, allowInteraction)

  const getMessage = () => {
    switch (messages[0]?.id) {
      case 'MISSING_ROUTE_REQUIRED_ACCOUNT':
        return (
          <MissingRouteRequiredAccountMessage
            chain={messages[0].props?.chain}
            address={messages[0].props?.address}
            {...props}
          />
        )
      case 'INSUFFICIENT_FUNDS':
        return <FundsSufficiencyMessage {...props} />
      case 'INSUFFICIENT_GAS':
        return (
          <GasSufficiencyMessage
            insufficientGas={messages[0].props?.insufficientGas}
            {...props}
          />
        )
      case 'MIN_FROM_AMOUNT_USD':
        return (
          <MinFromAmountUSDMessage
            minFromAmountUSD={messages[0].props?.minFromAmountUSD}
            {...props}
          />
        )
      case 'ACCOUNT_NOT_DEPLOYED':
        return <AccountNotDeployedMessage {...props} />
      case 'ACCOUNT_DEPLOYED':
        return <AccountDeployedMessage {...props} />
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
