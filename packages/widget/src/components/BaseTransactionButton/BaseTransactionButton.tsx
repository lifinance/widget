import { useAccount, useWalletMenu } from '@lifi/wallet-management'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useChain } from '../../hooks/useChain.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import type { BaseTransactionButtonProps } from './types.js'

export const BaseTransactionButton: React.FC<BaseTransactionButtonProps> = ({
  onClick,
  text,
  disabled,
  loading,
}) => {
  const { t } = useTranslation()
  const { walletConfig } = useWidgetConfig()
  const { openWalletMenu } = useWalletMenu()
  const [fromChainId] = useFieldValues('fromChain')
  const { chain } = useChain(fromChainId)
  const { account } = useAccount({ chainType: chain?.chainType })

  const handleClick = async () => {
    if (account.isConnected) {
      onClick?.()
    } else if (walletConfig?.onConnect) {
      walletConfig.onConnect()
    } else {
      openWalletMenu()
    }
  }

  const getButtonText = () => {
    if (account.isConnected) {
      if (text) {
        return text
      }
    }
    return t('button.connectWallet')
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      disabled={account.isConnected && disabled}
      loading={loading}
      loadingPosition="center"
      fullWidth
    >
      {getButtonText()}
    </Button>
  )
}
