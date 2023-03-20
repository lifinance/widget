import type { Route } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { Box, Collapse } from '@mui/material';
import {
  useFundsSufficiency,
  useGasRefuel,
  useGasSufficiency,
} from '../../hooks';
import { useRecommendedRouteStore, useSettings } from '../../stores';
import { FundsSufficiencyMessage } from './FundsSufficiencyMessage';
import { GasSufficiencyMessage } from './GasSufficiencyMessage';

interface GasMessageProps extends BoxProps {
  route?: Route;
}

export const GasMessage: React.FC<GasMessageProps> = ({ route, ...props }) => {
  const recommendedRoute = useRecommendedRouteStore(
    (state) => state.recommendedRoute,
  );

  const routeToCheck = route ?? recommendedRoute;

  const { insufficientGas } = useGasSufficiency(routeToCheck);
  const { insufficientFunds } = useFundsSufficiency(routeToCheck);

  const { enabledAutoRefuel } = useSettings(['enabledAutoRefuel']);
  const { enabled, isLoading: isRefuelLoading } = useGasRefuel();

  const enabledRefuel = enabled && enabledAutoRefuel;

  const showGasSufficiencyMessage =
    insufficientGas?.length && !isRefuelLoading && !enabledRefuel;

  return (
    <Collapse
      timeout={225}
      in={Boolean(insufficientFunds || showGasSufficiencyMessage)}
      unmountOnExit
      mountOnEnter
    >
      <Box {...props}>
        {insufficientFunds ? (
          <FundsSufficiencyMessage />
        ) : showGasSufficiencyMessage ? (
          <GasSufficiencyMessage insufficientGas={insufficientGas} />
        ) : null}
      </Box>
    </Collapse>
  );
};
