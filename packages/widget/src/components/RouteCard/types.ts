import type { Route } from '@lifi/sdk';

export interface RouteCardProps {
  route: Route;
  variant?: 'default' | 'cardless';
  active?: boolean;
  expanded?: boolean;
}

export interface RouteCardEssentialsProps {
  route: Route;
}

export interface RouteCardSkeletonProps {
  variant?: 'default' | 'cardless';
}
