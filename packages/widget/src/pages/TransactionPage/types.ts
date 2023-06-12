import type { Route } from '@lifi/sdk';
import type { DefaultTransactionButtonProps } from '../../components/DefaultTransactionButton';

export interface StartTransactionButtonProps
  extends DefaultTransactionButtonProps {
  route?: Route;
  insurableRouteId: string;
}
