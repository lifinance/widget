import type { CardProps } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { Card } from '../Card/Card'

export const ContractComponent: React.FC<PropsWithChildren<CardProps>> = ({
  children,
  ...props
}) => {
  if (!children) {
    return null
  }

  return <Card {...props}>{children}</Card>
}
