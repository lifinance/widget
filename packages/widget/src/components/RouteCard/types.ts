import type { Route, Token } from '@lifi/sdk';

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

export interface FeesBreakdown {
  amount: bigint;
  amountUSD: number;
  token: Token;
}
