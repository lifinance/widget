import { useWalletMenu } from '@lifi/wallet-management'
import { useTranslation } from 'react-i18next'
import { useChain } from '../../hooks/useChain.js'
import { useRouteRequiredAccountConnection } from '../../hooks/useRouteRequiredAccountConnection.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { cn } from '../../registry/lib/utils.js'
import { Button } from '../../registry/ui/button.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import type { BaseTransactionButtonProps } from './types.js'

export const BaseTransactionButton: React.FC<BaseTransactionButtonProps> = ({
  onClick,
  text,
  disabled,
  loading,
  route,
  className,
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
  const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
    if (connected) {
      onClick?.()
      return
    }
    const connectionOptions = missingChain ? { chain: missingChain } : undefined
    if (
      walletConfig?.onConnect &&
      !walletConfig?.forceInternalWalletManagement
    ) {
      walletConfig.onConnect(connectionOptions)
    } else {
      openWalletMenu(connectionOptions)
      e.currentTarget.blur() // Remove focus to prevent accessibility issues when opening drawer
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
      className={cn('w-full', className)}
      onClick={handleClick}
      disabled={Boolean((connected && disabled) || loading)}
      data-testid="widget-transaction-button"
    >
      <span>{getButtonText()}</span>
    </Button>
  )
}
