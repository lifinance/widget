import { useMemo } from 'react'
import { BaseTransactionButton } from '../../components/BaseTransactionButton/BaseTransactionButton'
import { useMessageQueue } from '../../components/Messages/useMessageQueue'
import type { StartTransactionButtonProps } from './types'

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
      route={route}
    />
  )
}
