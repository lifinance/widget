import type { SwapButtonProps } from '../../components/SwapButton';
import { SwapButton } from '../../components/SwapButton';
import { useGasSufficiency } from '../../hooks';

export const StartSwapButton: React.FC<SwapButtonProps> = ({
  onClick,
  currentRoute,
  text,
}) => {
  const {
    insufficientFunds,
    insufficientGas,
    isLoading: isGasSufficiencyLoading,
  } = useGasSufficiency(currentRoute);

  return (
    <SwapButton
      onClick={onClick}
      text={text}
      currentRoute={currentRoute}
      disabled={insufficientFunds || !!insufficientGas?.length}
      loading={isGasSufficiencyLoading}
    />
  );
};
