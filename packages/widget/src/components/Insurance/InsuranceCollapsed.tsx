import { Collapse } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { useSwapRoutes } from '../../hooks';
import {
  RouteExecutionStatus,
  useRouteExecutionStore,
  useSetExecutableRoute,
} from '../../stores';
import { InsuranceCard } from './InsuranceCard';
import type { InsuranceProps } from './types';

export const InsuranceCollapsed: React.FC<
  PropsWithChildren<InsuranceProps>
> = ({
  status,
  insurableRouteId,
  feeAmountUsd,
  onChange,
  children,
  ...props
}) => {
  const setExecutableRoute = useSetExecutableRoute();
  const routeExecution = useRouteExecutionStore(
    (state) => state.routes[insurableRouteId],
  );
  const { routes } = useSwapRoutes(routeExecution?.route);

  const toggleInsurance = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    const insuredRoute = routes?.[0];
    if (insuredRoute) {
      if (checked) {
        setExecutableRoute(insuredRoute, insurableRouteId);
      }
      onChange?.(checked ? insuredRoute.id : insurableRouteId);
    }
  };

  const insuredRoute = routes?.[0];

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
        onChange={toggleInsurance}
        {...props}
      />
    </Collapse>
  );
};
