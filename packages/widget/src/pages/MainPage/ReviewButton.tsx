import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BaseTransactionButton } from '../../components/BaseTransactionButton/BaseTransactionButton.js';
import { useRoutes } from '../../hooks/useRoutes.js';
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { useSetExecutableRoute } from '../../stores/routes/useSetExecutableRoute.js';
import { useSplitSubvariantStore } from '../../stores/settings/useSplitSubvariantStore.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';

export const ReviewButton: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setExecutableRoute = useSetExecutableRoute();
  const { subvariant } = useWidgetConfig();
  const splitState = useSplitSubvariantStore((state) => state.state);
  const [toAddress] = useFieldValues('toAddress');
  const { requiredToAddress } = useToAddressRequirements();
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
        case 'custom':
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
        case 'custom':
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
      disabled={currentRoute && requiredToAddress && !toAddress}
    />
  );
};
