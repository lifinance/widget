import { BaseTransactionButton } from '../../components/BaseTransactionButton/BaseTransactionButton.js'
import { useMessageQueue } from '../../components/Messages/useMessageQueue.js'
import type { StartTransactionButtonProps } from './types.js'

export const StartTransactionButton: React.FC<StartTransactionButtonProps> = ({
  onClick,
  route,
  text,
  loading,
}) => {
  const { hasMessages, isLoading } = useMessageQueue(route)

  return (
    <BaseTransactionButton
      onClick={onClick}
      text={text}
      disabled={hasMessages}
      loading={isLoading || loading}
    />
  )
}
