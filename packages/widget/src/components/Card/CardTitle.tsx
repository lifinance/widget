import { styled, Typography } from '@mui/material'
import type React from 'react'

export const CardTitle: React.FC<
  React.ComponentProps<typeof Typography> & { required?: boolean }
> = styled(Typography, {
  shouldForwardProp: (prop) => !['required'].includes(prop as string),
})<{ required?: boolean }>(({ theme }) => ({
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 700,
  padding: theme.spacing(2, 2, 0, 2),
  textAlign: 'left',
  color: theme.vars.palette.text.primary,
  '&:after': {
    content: 'none',
    color: theme.vars.palette.error.main,
  },
  variants: [
    {
      props: ({ required }) => required,
      style: {
        '&:after': {
          content: '" *"',
        },
      },
    },
  ],
}))
