import type { BoxProps } from '@mui/material';
import { useSwapRoutes } from '../../hooks';
import type { RouteExecutionStatus } from '../../stores';
import { useRouteExecutionStore } from '../../stores';
import { Switch } from '../Switch';

export const Insurance: React.FC<
  {
    available?: boolean;
    routeId: string;
    feeAmountUsd?: string;
    status?: RouteExecutionStatus;
    onChange?: (
      event: React.ChangeEvent<HTMLInputElement>,
      checked: boolean,
    ) => void;
  } & Omit<BoxProps, 'onChange'>
> = ({ status, feeAmountUsd, routeId, available, onChange, ...props }) => {
  const routeExecution = useRouteExecutionStore(
    (state) => state.routes[routeId],
  );
  const { routes, isLoading } = useSwapRoutes(routeExecution?.route);

  const handleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    // const insuredRoute = routes?.[0];
    // if (insuredRoute && checked) {
    //   setExecutableRoute(insuredRoute, stateRouteId);
    // }
    // setRouteId(checked ? insuredRoute?.id : stateRouteId);
    // onChange?.();
  };

  return <Switch onChange={handleChange} />;
};
