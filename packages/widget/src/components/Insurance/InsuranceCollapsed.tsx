import type { Route } from '@lifi/sdk';
import { Collapse } from '@mui/material';
import { useState } from 'react';
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
  const [insuredRoute, setInsuredRoute] = useState<Route>();
  const setExecutableRoute = useSetExecutableRoute();
  const routeExecution = useRouteExecutionStore(
    (state) => state.routes[insurableRouteId],
  );
  useSwapRoutes({
    insurableRoute: routeExecution?.route,
    onSettled(data) {
      if (data?.routes?.[0]) {
        setInsuredRoute(data.routes[0]);
      }
    },
  });

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
