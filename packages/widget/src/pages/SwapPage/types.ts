import type { Route } from '@lifi/sdk';

export interface StartSwapButtonProps {
  onClick?(): void;
  route?: Route;
  text?: string;
  disabled?: boolean;
  loading?: boolean;
  insurableRouteId: string;
}
