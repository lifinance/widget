import type { SxProps, Theme } from '@mui/material'
import type { FC, ReactNode } from 'react'
import { ActionRowContainer, ActionRowLabel } from './ActionRow.style.js'

interface ActionRowProps {
  message: string
  startAdornment: ReactNode
  endAdornment?: ReactNode
  sx?: SxProps<Theme>
}

export const ActionRow: FC<ActionRowProps> = ({
  message,
  startAdornment,
  endAdornment,
  sx,
}) => {
  return (
    <ActionRowContainer sx={sx}>
      {startAdornment}
      <ActionRowLabel>{message}</ActionRowLabel>
      {endAdornment}
    </ActionRowContainer>
  )
}
