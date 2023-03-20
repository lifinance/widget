import type { Route } from '@lifi/sdk';
import { SwapButton } from '../../components/SwapButton';
import { useFundsSufficiency, useGasSufficiency } from '../../hooks';

export interface StartSwapButtonProps {
  onClick?(): void;
  route?: Route;
  text?: string;
  disabled?: boolean;
  loading?: boolean;
}

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
