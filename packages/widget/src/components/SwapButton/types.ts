import type { Route } from '@lifi/sdk';

export interface SwapButtonProps {
  onClick?(): void;
  route?: Route;
  text?: string;
  disabled?: boolean;
  loading?: boolean;
}
