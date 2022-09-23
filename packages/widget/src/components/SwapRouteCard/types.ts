import type { Route } from '@lifi/sdk';

export interface SwapRouteCardProps {
  route: Route;
  variant?: 'default' | 'extended' | 'dense';
  active?: boolean;
}

export interface SwapRouteCardEssentialsProps {
  route: Route;
  dense?: boolean;
}

export interface SwapRouteCardSkeletonProps {
  variant?: 'default' | 'extended' | 'dense';
}
