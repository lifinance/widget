import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BaseTransactionButton } from '../../components/BaseTransactionButton';
import { useRequiredToAddress, useRoutes } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import {
  useSetExecutableRoute,
  useSplitSubvariantStore,
  useFieldValues,
} from '../../stores';
import { navigationRoutes } from '../../utils';

export const ReviewButton: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setExecutableRoute = useSetExecutableRoute();
  const { subvariant } = useWidgetConfig();
  const splitState = useSplitSubvariantStore((state) => state.state);
  const [toAddress] = useFieldValues('toAddress');
  const requiredToAddress = useRequiredToAddress();
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

  const getButtonText = (): string => {
    if (currentRoute) {
      switch (subvariant) {
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
      switch (subvariant) {
        case 'nft':
          return t(`button.buy`);
        case 'refuel':
          return t(`button.getGas`);
        case 'split':
          if (splitState) {
            return t(`button.${splitState}`);
          }
          return t(`button.exchange`);
        default:
          return t(`button.exchange`);
      }
    }
  };

  return (
    <BaseTransactionButton
      text={getButtonText()}
      onClick={handleClick}
      // TODO: Question: is this enough in place of isValid?
      disabled={currentRoute && requiredToAddress && !toAddress}
    />
  );
};
