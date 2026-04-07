import { Typography } from '@mui/material'
import type { JSX, PropsWithChildren, ReactNode } from 'react'
import { EmptyContainer, IconContainer } from './SendToWalletPage.style.js'

interface EmptyListIndicatorProps extends PropsWithChildren {
  icon: ReactNode
}
export const EmptyListIndicator = ({
  icon,
  children,
}: EmptyListIndicatorProps): JSX.Element => (
  <EmptyContainer>
    <IconContainer>{icon}</IconContainer>
    <Typography
      sx={{
        fontSize: 14,
        fontWeight: 700,
        color: 'text.secondary',
      }}
    >
      {children}
    </Typography>
  </EmptyContainer>
)
