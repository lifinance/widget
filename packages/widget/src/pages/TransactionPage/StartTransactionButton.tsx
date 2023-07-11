import { DefaultTransactionButton } from '../../components/DefaultTransactionButton';
import { useFundsSufficiency, useGasSufficiency, useRoutes } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { useRouteExecutionStore } from '../../stores';
import type { StartTransactionButtonProps } from './types';

export const StartTransactionButton: React.FC<StartTransactionButtonProps> = ({
  onClick,
  route,
  text,
  loading,
}) => {
  const { sdkConfig } = useWidgetConfig();
  const isMultisigSigner = sdkConfig?.multisigConfig?.isMultisigSigner;

  const { insufficientGas, isInitialLoading: isGasSufficiencyLoading } =
    useGasSufficiency(route);
  const { insufficientFunds, isInitialLoading: isFundsSufficiencyLoading } =
    useFundsSufficiency(route);

  const shouldDisableButton =
    !isMultisigSigner && (insufficientFunds || !!insufficientGas?.length);

  return (
    <DefaultTransactionButton
      onClick={onClick}
      text={text}
      disabled={shouldDisableButton}
      loading={isFundsSufficiencyLoading || isGasSufficiencyLoading || loading}
    />
  );
};

export const StartInsurableTransactionButton: React.FC<
  StartTransactionButtonProps
> = ({ onClick, text, route, loading, disabled, insurableRouteId }) => {
  const routeExecution = useRouteExecutionStore(
    (state) => state.routes[insurableRouteId],
  );
  const { isFetching } = useRoutes({
    insurableRoute: routeExecution?.route,
  });

  return (
    <StartTransactionButton
      onClick={onClick}
      text={text}
      route={route}
      disabled={disabled}
      loading={loading || isFetching}
      insurableRouteId={insurableRouteId}
    />
  );
};
