import { Collapse } from '@mui/material';
import { useRoutes } from '../../hooks';
import {
  RouteExecutionStatus,
  useRouteExecutionStore,
  useSetExecutableRoute,
} from '../../stores';
import { formatTokenAmount } from '../../utils';
import { InsuranceCard } from './InsuranceCard';
import type { InsuranceProps } from './types';

export const InsuranceCollapsed: React.FC<InsuranceProps> = ({
  status,
  insurableRouteId,
  onChange,
  ...props
}) => {
  const setExecutableRoute = useSetExecutableRoute();
  const routeExecution = useRouteExecutionStore(
    (state) => state.routes[insurableRouteId],
  );
  const { routes } = useRoutes({
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

  if (!insuredRoute) {
    return null;
  }

  return (
    <Collapse
      timeout={225}
      in={insuredRoute.insurance.state === 'INSURED'}
      unmountOnExit
      mountOnEnter
      appear={status === RouteExecutionStatus.Idle}
    >
      <InsuranceCard
        {...props}
        status={status}
        insuredAmount={formatTokenAmount(
          insuredRoute.toAmountMin,
          insuredRoute.toToken.decimals,
        )}
        insuredTokenSymbol={insuredRoute.toToken.symbol}
        onChange={toggleInsurance}
      />
    </Collapse>
  );
};
