import { Route } from '@lifinance/sdk';

export interface TransactionStepperProps {
  route: Route;
}

export type Props = {
  children?: React.ReactNode;
  active?: boolean;
  action?: boolean;
  error?: boolean;
};
