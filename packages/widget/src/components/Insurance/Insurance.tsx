import { RouteExecutionStatus } from '../../stores';
import { InsuranceCard } from './InsuranceCard';
import { InsuranceCollapsed } from './InsuranceCollapsed';
import type { InsuranceProps } from './types';

export const Insurance: React.FC<InsuranceProps> = ({
  status,
  insurableRouteId,
  feeAmountUsd,
  insuranceCoverageId,
  onChange,
  ...props
}) => {
  return status === RouteExecutionStatus.Idle ? (
    <InsuranceCollapsed
      insurableRouteId={insurableRouteId}
      feeAmountUsd={feeAmountUsd}
      insuranceCoverageId={insuranceCoverageId}
      status={status}
      onChange={onChange}
      {...props}
    />
  ) : (
    <InsuranceCard
      feeAmountUsd={feeAmountUsd}
      status={status}
      insuranceCoverageId={insuranceCoverageId}
      {...props}
    />
  );
};
