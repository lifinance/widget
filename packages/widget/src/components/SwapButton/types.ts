import { Route } from '@lifi/sdk';

export interface SwapButtonProps {
  onClick?(): void;
  currentRoute?: Route;
  text?: string;
  loading?: boolean;
}
