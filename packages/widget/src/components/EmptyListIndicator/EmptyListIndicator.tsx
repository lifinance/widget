import type { JSX, ReactNode } from 'react'
import {
  EmptyListContainer,
  EmptyListIcon,
  EmptyListMessage,
  EmptyListTitle,
} from './EmptyListIndicator.style.js'

interface EmptyListIndicatorProps {
  icon: ReactNode
  title: string
  message?: string
}

export const EmptyListIndicator = ({
  icon,
  title,
  message,
}: EmptyListIndicatorProps): JSX.Element => (
  <EmptyListContainer>
    <EmptyListIcon>{icon}</EmptyListIcon>
    <EmptyListTitle>{title}</EmptyListTitle>
    {message ? <EmptyListMessage>{message}</EmptyListMessage> : null}
  </EmptyListContainer>
)
