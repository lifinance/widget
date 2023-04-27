import type { BoxProps } from '@mui/material';
import type { RouteExecutionStatus } from '../../stores';

export interface InsuranceProps extends Omit<BoxProps, 'onChange'> {
  insurableRouteId: string;
  feeAmountUsd?: string;
  insuranceCoverageId?: string;
  status?: RouteExecutionStatus;
  onChange?: (routeId: string) => void;
}

export interface InsuranceCardProps {
  feeAmountUsd?: string;
  status?: RouteExecutionStatus;
  insuranceCoverageId?: string;
  onChange?: (checked: boolean) => void;
}
