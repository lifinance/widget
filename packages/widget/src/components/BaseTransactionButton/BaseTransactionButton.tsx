import { useWalletMenu } from '@lifi/wallet-management'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useChain } from '../../hooks/useChain.js'
import { useRouteRequiredAccountConnection } from '../../hooks/useRouteRequiredAccountConnection.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import type { BaseTransactionButtonProps } from './types.js'

export const BaseTransactionButton: React.FC<BaseTransactionButtonProps> = ({
  onClick,
  text,
  disabled,
  loading,
  route,
}) => {
  const { t } = useTranslation()
  const { walletConfig } = useWidgetConfig()
  const { openWalletMenu } = useWalletMenu()
  const [fromChainId] = useFieldValues('fromChain')
  const { chain } = useChain(fromChainId)
  const { connected, missingChain } = useRouteRequiredAccountConnection(
    route,
    chain
  )

  const handleClick = async () => {
    if (connected) {
      onClick?.()
    } else if (walletConfig?.onConnect) {
      walletConfig.onConnect()
    } else {
      openWalletMenu()
    }
  }

  const getButtonText = () => {
    if (connected) {
      if (text) {
        return text
      }
    }
    return missingChain
      ? t('button.connectChainWallet', {
          chain: missingChain.name,
        })
      : t('button.connectWallet')
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      disabled={connected && disabled}
      loading={loading}
      loadingPosition="center"
      fullWidth
    >
      {getButtonText()}
    </Button>
  )
}
