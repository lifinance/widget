import { RouteExecutionStatus } from '../../stores';
import { InsuranceCard } from './InsuranceCard';
import { InsuranceCollapsed } from './InsuranceCollapsed';
import type { InsuranceProps } from './types';

export const Insurance: React.FC<InsuranceProps> = ({
  status,
  insurableRouteId,
  onChange,
  ...props
}) => {
  return status === RouteExecutionStatus.Idle ? (
    <InsuranceCollapsed
      status={status}
      insurableRouteId={insurableRouteId}
      onChange={onChange}
      {...props}
    />
  ) : (
    <InsuranceCard status={status} {...props} />
  );
};
