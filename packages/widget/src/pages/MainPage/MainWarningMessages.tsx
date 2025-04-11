import type { Route } from '@lifi/sdk'
import type { BoxProps } from '@mui/material'
import { WarningMessages } from '../../components/Messages/WarningMessages.js'
import { useRoutes } from '../../hooks/useRoutes.js'

interface MainWarningMessagesProps extends BoxProps {
  route?: Route
}

export const MainWarningMessages: React.FC<MainWarningMessagesProps> = (
  props
) => {
  const { routes } = useRoutes()
  const currentRoute = routes?.[0]

  return <WarningMessages route={currentRoute} {...props} />
}
