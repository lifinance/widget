import { SwapButton } from '../../components/SwapButton';
import {
  useFundsSufficiency,
  useGasSufficiency,
  useSwapRoutes,
} from '../../hooks';
import { useRouteExecutionStore } from '../../stores';
import type { StartSwapButtonProps } from './types';

export const StartSwapButton: React.FC<StartSwapButtonProps> = ({
  onClick,
  route,
  text,
  loading,
}) => {
  const { insufficientGas, isInitialLoading: isGasSufficiencyLoading } =
    useGasSufficiency(route);
  const { insufficientFunds, isInitialLoading: isFundsSufficiencyLoading } =
    useFundsSufficiency(route);

  return (
    <SwapButton
      onClick={onClick}
      text={text}
      hasRoute={Boolean(route)}
      disabled={insufficientFunds || !!insufficientGas?.length}
      loading={isFundsSufficiencyLoading || isGasSufficiencyLoading || loading}
    />
  );
};

export const StartIdleSwapButton: React.FC<StartSwapButtonProps> = ({
  onClick,
  route,
  text,
  loading,
  disabled,
  insurableRouteId,
}) => {
  const routeExecution = useRouteExecutionStore(
    (state) => state.routes[insurableRouteId],
  );
  const { isLoading } = useSwapRoutes(routeExecution?.route);

  return (
    <StartSwapButton
      onClick={onClick}
      text={text}
      route={route}
      disabled={disabled}
      loading={loading || isLoading}
      insurableRouteId={insurableRouteId}
    />
  );
};
