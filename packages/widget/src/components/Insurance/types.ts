import type { BoxProps } from '@mui/material';
import type { RouteExecutionStatus } from '../../stores';

export interface InsuredAmount {
  insuredAmount: string;
  insuredTokenSymbol: string;
}

interface Insurance extends InsuredAmount {
  feeAmountUsd: string;
  insuranceCoverageId?: string;
  status?: RouteExecutionStatus;
}

export interface InsuranceProps extends Insurance, Omit<BoxProps, 'onChange'> {
  insurableRouteId: string;
  onChange?: (routeId: string) => void;
}

export interface InsuranceCardProps
  extends Insurance,
    Omit<BoxProps, 'onChange'> {
  onChange?: (checked: boolean) => void;
}
