import { BaseTransactionButton } from '../../components/BaseTransactionButton/BaseTransactionButton.js'
import { useFromTokenSufficiency } from '../../hooks/useFromTokenSufficiency.js'
import { useGasSufficiency } from '../../hooks/useGasSufficiency.js'
import type { StartTransactionButtonProps } from './types.js'

export const StartTransactionButton: React.FC<StartTransactionButtonProps> = ({
  onClick,
  route,
  text,
  loading,
}) => {
  const { insufficientGas, isLoading: isGasSufficiencyLoading } =
    useGasSufficiency(route)
  const { insufficientFromToken, isLoading: isFromTokenSufficiencyLoading } =
    useFromTokenSufficiency(route)

  const shouldDisableButton = insufficientFromToken || !!insufficientGas?.length

  return (
    <BaseTransactionButton
      onClick={onClick}
      text={text}
      disabled={shouldDisableButton}
      loading={
        isFromTokenSufficiencyLoading || isGasSufficiencyLoading || loading
      }
    />
  )
}
