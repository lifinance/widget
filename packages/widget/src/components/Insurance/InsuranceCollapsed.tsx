import { Collapse } from '@mui/material';
import { useSwapRoutes } from '../../hooks';
import {
  RouteExecutionStatus,
  useRouteExecutionStore,
  useSetExecutableRoute,
} from '../../stores';
import { InsuranceCard } from './InsuranceCard';
import type { InsuranceProps } from './types';

export const InsuranceCollapsed: React.FC<InsuranceProps> = ({
  status,
  insurableRouteId,
  insuranceCoverageId,
  feeAmountUsd,
  onChange,
  ...props
}) => {
  const setExecutableRoute = useSetExecutableRoute();
  const routeExecution = useRouteExecutionStore(
    (state) => state.routes[insurableRouteId],
  );
  const { routes } = useSwapRoutes({
    insurableRoute: routeExecution?.route,
  });

  const insuredRoute = routes?.[0];

  const toggleInsurance = (checked: boolean) => {
    if (insuredRoute) {
      if (checked) {
        setExecutableRoute(insuredRoute, insurableRouteId);
      }
      onChange?.(checked ? insuredRoute.id : insurableRouteId);
    }
  };

  return (
    <Collapse
      timeout={225}
      in={insuredRoute?.insurance?.state === 'INSURED'}
      unmountOnExit
      mountOnEnter
      appear={status === RouteExecutionStatus.Idle}
    >
      <InsuranceCard
        feeAmountUsd={feeAmountUsd}
        status={status}
        insuranceCoverageId={insuranceCoverageId}
        onChange={toggleInsurance}
        {...props}
      />
    </Collapse>
  );
};
