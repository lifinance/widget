import { useMemo } from 'react'
import { BaseTransactionButton } from '../../components/BaseTransactionButton/BaseTransactionButton.js'
import { useMessageQueue } from '../../components/Messages/useMessageQueue.js'
import type { StartTransactionButtonProps } from './types.js'

export const StartTransactionButton: React.FC<StartTransactionButtonProps> = ({
  onClick,
  route,
  text,
  loading,
}) => {
  const { messages, isLoading } = useMessageQueue(route, true)

  const hasNonGasMessages = useMemo(() => {
    return messages.some((message) => message.id !== 'INSUFFICIENT_GAS')
  }, [messages])

  return (
    <BaseTransactionButton
      onClick={onClick}
      text={text}
      disabled={hasNonGasMessages}
      loading={isLoading || loading}
    />
  )
}
