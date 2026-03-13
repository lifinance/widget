import type { FC, ReactNode } from 'react'
import { ActionRowContainer, ActionRowLabel } from './ActionRow.style.js'

interface ActionRowProps {
  message: string
  startAdornment: ReactNode
  endAdornment?: ReactNode
}

export const ActionRow: FC<ActionRowProps> = ({
  message,
  startAdornment,
  endAdornment,
}) => {
  return (
    <ActionRowContainer>
      {startAdornment}
      <ActionRowLabel>{message}</ActionRowLabel>
      {endAdornment}
    </ActionRowContainer>
  )
}
