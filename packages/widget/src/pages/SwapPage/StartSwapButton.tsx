import type { SwapButtonProps } from '../../components/SwapButton';
import { SwapButton } from '../../components/SwapButton';
import { useFundsSufficiency, useGasSufficiency } from '../../hooks';

export const StartSwapButton: React.FC<SwapButtonProps> = ({
  onClick,
  currentRoute,
  text,
}) => {
  const { insufficientGas, isInitialLoading: isGasSufficiencyLoading } =
    useGasSufficiency(currentRoute);
  const { insufficientFunds, isInitialLoading: isFundsSufficiencyLoading } =
    useFundsSufficiency(currentRoute);

  return (
    <SwapButton
      onClick={onClick}
      text={text}
      currentRoute={currentRoute}
      disabled={insufficientFunds || !!insufficientGas?.length}
      loading={isFundsSufficiencyLoading || isGasSufficiencyLoading}
    />
  );
};
