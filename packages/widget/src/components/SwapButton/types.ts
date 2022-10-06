import type { Route } from '@lifi/sdk';

export interface SwapButtonProps {
  onClick?(): void;
  currentRoute?: Route;
  text?: string;
  disable?: boolean;
  loading?: boolean;
  enableLoading?: boolean;
}
