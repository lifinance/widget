import {
  inputAdornmentClasses,
  inputBaseClasses,
  styled,
  svgIconClasses,
} from '@mui/material'
import type React from 'react'
import { Input as InputBase } from '../../components/Input.js'

interface InputProps {
  size?: 'small' | 'medium'
}

export const Input: React.FC<
  React.ComponentProps<typeof InputBase> & InputProps
> = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'size',
})<InputProps>(({ theme, size = 'medium' }) => ({
  paddingRight: size === 'small' ? theme.spacing(1.25) : theme.spacing(1.75),
  paddingLeft: theme.spacing(1.25),
  fontSize: size === 'small' ? '0.875rem' : '1rem',
  borderRadius: theme.vars.shape.borderRadius,
  [theme.breakpoints.down(theme.breakpoints.values.xs)]: {
    paddingRight: theme.spacing(1.25),
  },
  [`& .${inputBaseClasses.input}`]: {
    padding: theme.spacing(1),
  },
  [`& .${inputAdornmentClasses.root}`]: {
    marginLeft: 0,
    marginRight: 0,
    [`& .${svgIconClasses.root}`]: {
      width: size === 'small' ? '1.25rem' : '1.5rem',
    },
  },
  [`& .${inputAdornmentClasses.root}.${inputAdornmentClasses.positionEnd}`]: {
    marginRight: size === 'small' ? theme.spacing(-0.5) : theme.spacing(-1),
    [`& .${svgIconClasses.root}`]: {
      width: size === 'small' ? '1rem' : '1.25rem',
      height: size === 'small' ? '1rem' : '1.25rem',
    },
  },
}))
