import type { ExtendedChain, Route } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { Stack, Typography } from '@mui/material'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { PageContainer } from '../PageContainer.js'
import { ProgressToNextUpdate } from '../ProgressToNextUpdate.js'
import { RouteCard } from '../RouteCard/RouteCard.js'
import { RouteCardSkeleton } from '../RouteCard/RouteCardSkeleton.js'
import { RouteNotFoundCard } from '../RouteCard/RouteNotFoundCard.js'
import { Container, Header } from './RoutesExpanded.style.js'

interface RoutesContentProps {
  routes?: Route[]
  isFetching: boolean
  isLoading: boolean
  dataUpdatedAt: number
  refetchTime: number
  fromChain: ExtendedChain | undefined
  refetch: () => void
  onRouteClick: (route: Route) => void
}

const headerHeight = '64px'

export const RoutesContent = memo(function RoutesContent({
  routes,
  isFetching,
  isLoading,
  dataUpdatedAt,
  refetchTime,
  fromChain,
  refetch,
  onRouteClick,
}: RoutesContentProps) {
  const { t } = useTranslation()
  const { subvariant, subvariantOptions } = useWidgetConfig()

  const { account } = useAccount({ chainType: fromChain?.chainType })
  const [toAddress] = useFieldValues('toAddress')
  const { requiredToAddress } = useToAddressRequirements()

  const currentRoute = routes?.[0]

  const routeNotFound = !currentRoute && !isLoading && !isFetching
  const toAddressUnsatisfied = currentRoute && requiredToAddress && !toAddress
  const allowInteraction = account.isConnected && !toAddressUnsatisfied

  const title =
    subvariant === 'custom'
      ? subvariantOptions?.custom === 'deposit'
        ? t('header.deposit')
        : t('header.youPay')
      : t('header.receive')

  return (
    <Container enableColorScheme minimumHeight={isLoading}>
      <Header sx={{ height: headerHeight }}>
        <Typography
          noWrap
          sx={{
            fontSize: 18,
            fontWeight: '700',
            flex: 1,
          }}
        >
          {title}
        </Typography>
        <ProgressToNextUpdate
          updatedAt={dataUpdatedAt || Date.now()}
          timeToUpdate={refetchTime}
          isLoading={isFetching}
          onClick={() => refetch()}
          sx={{ marginRight: -1 }}
        />
      </Header>
      <PageContainer
        sx={{ height: `calc(100% - ${headerHeight})`, overflow: 'auto' }}
      >
        <Stack
          direction="column"
          spacing={2}
          sx={{
            flex: 1,
            paddingBottom: 3,
          }}
        >
          {routeNotFound ? (
            <RouteNotFoundCard />
          ) : (isLoading || isFetching) && !routes?.length ? (
            Array.from({ length: 3 }).map((_, index) => (
              <RouteCardSkeleton key={index} />
            ))
          ) : (
            routes?.map((route: Route, index: number) => (
              <RouteCard
                key={index}
                route={route}
                onClick={
                  allowInteraction ? () => onRouteClick(route) : undefined
                }
                active={index === 0}
                expanded={routes?.length === 1}
              />
            ))
          )}
        </Stack>
      </PageContainer>
    </Container>
  )
})
