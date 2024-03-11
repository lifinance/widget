import type { CardProps } from '@mui/material';
import type { RouteExecutionStatus } from '../../stores/routes/types.js';

export interface InsuredAmount {
  insuredAmount: string;
  insuredTokenSymbol: string;
}

interface Insurance extends InsuredAmount {
  feeAmountUsd: string;
  insuranceCoverageId?: string;
  status?: RouteExecutionStatus;
}

export interface InsuranceProps extends Insurance, Omit<CardProps, 'onChange'> {
  insurableRouteId: string;
  onChange?: (routeId: string) => void;
}

export interface InsuranceCardProps
  extends Insurance,
    Omit<CardProps, 'onChange'> {
  onChange?: (checked: boolean) => void;
}
