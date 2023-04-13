import type { BoxProps } from '@mui/material';
import type { RouteExecutionStatus } from '../../stores';

export interface InsuranceProps extends Omit<BoxProps, 'onChange'> {
  insurableRouteId: string;
  feeAmountUsd?: string;
  status?: RouteExecutionStatus;
  onChange?: (routeId: string) => void;
}

export interface InsuranceCardProps {
  feeAmountUsd?: string;
  status?: RouteExecutionStatus;
  onChange?: (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}
