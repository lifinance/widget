import type { Route, Token } from '@lifi/sdk';
import type { SetStateAction } from 'react';

export interface RouteCardProps {
  route: Route;
  variant?: 'default' | 'cardless';
  active?: boolean;
  expanded?: boolean;
}

export interface RouteCardEssentialsProps {
  route: Route;
  dense?: boolean;
  expanded?: boolean;
  onClick?(value: SetStateAction<boolean | undefined>): void;
}

export interface RouteCardSkeletonProps {
  variant?: 'default' | 'cardless';
}

export interface FeesBreakdown {
  amount: bigint;
  amountUSD: number;
  token: Token;
}
