import { useAccount } from '@lifi/wallet-management'
import { Stack } from '@mui/material'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import type { CardProps } from '../Card/Card.js'
import { RouteNotFoundCard } from '../RouteCard/RouteNotFoundCard.js'
import {
  RouteProviderCard,
  RouteProviderCardSkeleton,
} from '../RouteCard/RouteProviderCard.js'

export const LimitOrderRoutes: React.FC<CardProps> = (props) => {
  const { routes, isLoading, isFetching, isFetched, fromChain } = useRoutes()
  const { account } = useAccount({ chainType: fromChain?.chainType })
  const [toAddress, selectedRouteId] = useFieldValues(
    'toAddress',
    'selectedRouteId'
  )
  const { setFieldValue } = useFieldActions()
  const { requiredToAddress } = useToAddressRequirements()

  const currentRoute = routes?.[0]

  if (!currentRoute && !isLoading && !isFetching && !isFetched) {
    return null
  }

  const toAddressUnsatisfied = currentRoute && requiredToAddress && !toAddress
  const allowInteraction = account.isConnected && !toAddressUnsatisfied

  // Falls back to the best route when nothing is selected yet or the previously
  // selected provider is no longer present in the latest results. Matching by
  // provider key (not route id) keeps the pick stable across refetches, since
  // route ids are regenerated on every fetch.
  const activeRouteId =
    routes?.find((route) => route.id === selectedRouteId)?.id ??
    currentRoute?.id

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={props.sx}
      className={props.className}
    >
      {isLoading && !currentRoute ? (
        Array.from({ length: 2 }).map((_, index) => (
          <RouteProviderCardSkeleton key={index} />
        ))
      ) : !currentRoute ? (
        <RouteNotFoundCard />
      ) : (
        routes?.map((route) => (
          <RouteProviderCard
            key={route.id}
            route={route}
            active={route.id === activeRouteId}
            onClick={
              allowInteraction
                ? () => setFieldValue('selectedRouteId', route.id)
                : undefined
            }
          />
        ))
      )}
    </Stack>
  )
}
