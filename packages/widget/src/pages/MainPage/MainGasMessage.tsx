import type { BoxProps } from '@mui/material';
import { GasMessage } from '../../components/GasMessage/GasMessage.js';
import { useRoutes } from '../../hooks/useRoutes.js';

export const MainGasMessage: React.FC<BoxProps> = (props) => {
  const { routes } = useRoutes();

  const currentRoute = routes?.[0];

  return <GasMessage route={currentRoute} {...props} />;
};
