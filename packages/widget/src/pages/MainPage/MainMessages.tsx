import type { BoxProps } from '@mui/material';
import { GasMessage } from '../../components/GasMessage/GasMessage.js';
import { ToAddressRequiredMessage } from '../../components/ToAddressRequiredMessage.js';
import { useRoutes } from '../../hooks/useRoutes.js';

export const MainMessages: React.FC<BoxProps> = (props) => {
  const { routes } = useRoutes();

  const currentRoute = routes?.[0];

  return (
    <>
      <ToAddressRequiredMessage route={currentRoute} {...props} />
      <GasMessage route={currentRoute} {...props} />
    </>
  );
};
