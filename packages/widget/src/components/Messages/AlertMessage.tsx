import type { BoxProps } from '@mui/material'
import type { PropsWithChildren, ReactNode } from 'react'
import {
  AlertMessageCard,
  AlertMessageCardTitle,
} from './AlertMessage.style.js'
import type { Severity } from './types.js'

interface AlertMessageProps extends PropsWithChildren<Omit<BoxProps, 'title'>> {
  icon: ReactNode
  title: ReactNode
  multiline?: boolean
  severity?: Severity
}

export const AlertMessage = ({
  title,
  icon,
  children,
  multiline,
  severity = 'info',
  ...rest
}: AlertMessageProps) => (
  <AlertMessageCard severity={severity} {...rest}>
    <AlertMessageCardTitle
      severity={severity}
      alignItems={multiline ? 'start' : 'center'}
    >
      {icon}
      {title}
    </AlertMessageCardTitle>
    {children}
  </AlertMessageCard>
)
