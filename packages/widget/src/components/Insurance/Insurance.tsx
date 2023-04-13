import { RouteExecutionStatus } from '../../stores';
import { InsuranceCard } from './InsuranceCard';
import { InsuranceCollapsed } from './InsuranceCollapsed';
import type { InsuranceProps } from './types';

export const Insurance: React.FC<InsuranceProps> = ({
  status,
  insurableRouteId,
  feeAmountUsd,
  onChange,
  ...props
}) => {
  return status === RouteExecutionStatus.Idle ? (
    <InsuranceCollapsed
      insurableRouteId={insurableRouteId}
      feeAmountUsd={feeAmountUsd}
      status={status}
      onChange={onChange}
      {...props}
    />
  ) : (
    <InsuranceCard feeAmountUsd={feeAmountUsd} status={status} {...props} />
  );
};
