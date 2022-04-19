export interface SwapRouteCardProps {
  amount: string | number;
  token: string;
  time: string;
  gas: string;
  type: 'recommended' | 'fastest' | 'cheapest';
  active?: boolean;
  blur?: boolean;
}
