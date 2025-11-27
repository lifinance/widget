import type { Route } from '@lifi/sdk'
import type { BoxProps } from '@mui/material'
import { WarningMessages } from '../../components/Messages/WarningMessages'
import { useRoutes } from '../../hooks/useRoutes'

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
