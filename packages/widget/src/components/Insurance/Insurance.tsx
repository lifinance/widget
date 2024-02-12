import { RouteExecutionStatus } from '../../stores/routes/types.js';
import { InsuranceCard } from './InsuranceCard.js';
import { InsuranceCollapsed } from './InsuranceCollapsed.js';
import type { InsuranceProps } from './types.js';

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
