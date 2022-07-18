import { useNavigate } from 'react-router-dom';
import { SwapButton } from '../../components/SwapButton';
import { useSwapRoutes } from '../../hooks';
import { useCurrentRoute, useSetExecutableRoute } from '../../stores';
import { navigationRoutes } from '../../utils';

export const MainSwapButton: React.FC = () => {
  const navigate = useNavigate();
  const [currentRoute] = useCurrentRoute();
  const setExecutableRoute = useSetExecutableRoute();

  const { routes: swapRoutes, isLoading, isFetching } = useSwapRoutes();

  const handleClick = async () => {
    if (
      currentRoute &&
      swapRoutes?.some((route) => route.id === currentRoute.id)
    ) {
      setExecutableRoute(currentRoute);
      navigate(navigationRoutes.swap, {
        state: { routeId: currentRoute.id },
      });
    }
  };

  return <SwapButton onClick={handleClick} loading={isLoading || isFetching} />;
};
