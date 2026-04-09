import type { Route, RouteExtended } from '@lifi/sdk'

export interface RouteCardProps {
  route: Route
  variant?: 'default' | 'cardless'
  active?: boolean
  expanded?: boolean
}

export interface RouteCardEssentialsProps {
  route: RouteExtended
}

export interface RouteCardSkeletonProps {
  variant?: 'default' | 'cardless'
}
