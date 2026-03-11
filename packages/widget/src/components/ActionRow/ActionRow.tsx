import Wallet from '@mui/icons-material/Wallet'
import { CircularProgress } from '@mui/material'
import type { FC, ReactNode } from 'react'
import { IconCircle } from '../IconCircle/IconCircle.js'
import {
  ActionIconCircle,
  ActionRowContainer,
  ActionRowLabel,
} from './ActionRow.style.js'

export type ActionRowVariant = 'success' | 'error' | 'wallet' | 'pending'

interface ActionRowProps {
  variant: ActionRowVariant
  message: string
  endAdornment?: ReactNode
}

const startIcons: Record<ActionRowVariant, FC> = {
  success: () => <IconCircle status="success" size={24} />,
  error: () => <IconCircle status="error" size={24} />,
  wallet: () => (
    <ActionIconCircle>
      <Wallet color="success" sx={{ fontSize: 16 }} />
    </ActionIconCircle>
  ),
  pending: () => <CircularProgress size={20} />,
}

export const ActionRow: FC<ActionRowProps> = ({
  variant,
  message,
  endAdornment,
}) => {
  const StartIcon = startIcons[variant]

  return (
    <ActionRowContainer>
      <StartIcon />
      <ActionRowLabel>{message}</ActionRowLabel>
      {endAdornment}
    </ActionRowContainer>
  )
}
