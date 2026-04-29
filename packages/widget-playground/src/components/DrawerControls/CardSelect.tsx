import { Box, Collapse } from '@mui/material'
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
      <Collapse in={!!footer} sx={{ width: '100%' }} unmountOnExit>
        <Box
          onClick={(e) => {
            e.stopPropagation()
          }}
          sx={{ width: '100%', paddingTop: '16px' }}
        >
          {footer}
        </Box>
      </Collapse>
    </CardSelectRoot>
  )
}
