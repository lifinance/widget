import { Box } from '@mui/material'
import type { JSX, ReactNode } from 'react'
import {
  CardDescription,
  CardSelectRoot,
  CardTextContainer,
  CardTitle,
} from './CardSelect.style.js'

interface CardSelectProps {
  title: string
  description: string
  selected: boolean
  onClick: () => void
  footer?: ReactNode
  disabled?: boolean
}

export const CardSelect = ({
  title,
  description,
  selected,
  onClick,
  footer,
  disabled = false,
}: CardSelectProps): JSX.Element => {
  return (
    <CardSelectRoot
      selected={selected}
      onClick={disabled ? undefined : onClick}
      disableRipple
      disabled={disabled}
    >
      <CardTextContainer>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardTextContainer>
      {footer ? (
        <Box
          onClick={(e) => {
            e.stopPropagation()
          }}
          sx={{ width: '100%' }}
        >
          {footer}
        </Box>
      ) : null}
    </CardSelectRoot>
  )
}
