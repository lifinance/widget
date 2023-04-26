import type { BoxProps } from '@mui/material';
import { GasMessage } from '../../components/GasMessage';
import { useSwapRoutes } from '../../hooks';

export const MainGasMessage: React.FC<BoxProps> = (props) => {
  const { routes } = useSwapRoutes();

  const currentRoute = routes?.[0];

  return <GasMessage route={currentRoute} {...props} />;
};
