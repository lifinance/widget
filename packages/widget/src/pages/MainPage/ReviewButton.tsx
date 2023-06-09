import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DefaultTransactionButton } from '../../components/DefaultTransactionButton';
import { useRoutes } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { useSetExecutableRoute, useSplitSubvariantStore } from '../../stores';
import { navigationRoutes } from '../../utils';

export const ReviewButton: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isValid, isValidating } = useFormState();
  const setExecutableRoute = useSetExecutableRoute();
  const { variant, subvariant } = useWidgetConfig();
  const splitState = useSplitSubvariantStore((state) => state.state);

  const { routes } = useRoutes();

  const currentRoute = routes?.[0];

  const handleClick = async () => {
    if (currentRoute) {
      setExecutableRoute(currentRoute);
      navigate(navigationRoutes.transactionExecution, {
        state: { routeId: currentRoute.id },
      });
    }
  };

  const getButtonText = () => {
    if (currentRoute) {
      switch (variant) {
        case 'nft':
          return t(`button.reviewPurchase`);
        case 'refuel':
          return t(`button.reviewBridge`);
        default:
          const transactionType =
            currentRoute.fromChainId === currentRoute.toChainId
              ? 'Swap'
              : 'Bridge';
          return t(`button.review${transactionType}`);
      }
    } else {
      switch (variant) {
        case 'nft':
          return t(`button.buy`);
        case 'refuel':
          return t(`button.getGas`);
        default:
          if (subvariant === 'split' && splitState) {
            return t(`button.${splitState}`);
          }
          return t(`button.exchange`);
      }
    }
  };

  return (
    <DefaultTransactionButton
      text={getButtonText()}
      onClick={handleClick}
      disabled={currentRoute && (isValidating || !isValid)}
    />
  );
};
