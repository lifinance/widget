import type { Route } from '@lifi/sdk';

export interface SwapRouteCardProps {
  route: Route;
  variant?: 'default' | 'cardless';
  active?: boolean;
  expanded?: boolean;
}

export interface SwapRouteCardEssentialsProps {
  route: Route;
  dense?: boolean;
}

export interface SwapRouteCardSkeletonProps {
  variant?: 'default' | 'cardless';
}
