import type { Route } from '@lifi/sdk';
import type { BaseTransactionButtonProps } from '../../components/BaseTransactionButton/types.js';

export interface StartTransactionButtonProps
  extends BaseTransactionButtonProps {
  route?: Route;
  insurableRouteId: string;
}
