import { Route } from '@lifi/sdk';

export interface SwapRouteCardProps {
  route: Route;
  dense?: boolean;
  active?: boolean;
  blur?: boolean;
}

export interface SwapRouteCardSkeletonProps {
  dense?: boolean;
  active?: boolean;
  blur?: boolean;
}
