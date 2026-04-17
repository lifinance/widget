import {
  Badge,
  Box,
  CircularProgress as MuiCircularProgress,
  IconButton as MuiIconButton,
  styled,
} from '@mui/material'
import type React from 'react'

export const ErrorBadge: React.FC<React.ComponentProps<typeof Badge>> = styled(
  Badge
)(({ theme }) => ({
  '& .MuiBadge-badge': {
    padding: 0,
    minWidth: 16,
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: theme.vars.palette.background.paper,
    boxShadow: `0 0 0 2px ${theme.vars.palette.background.paper}`,
    top: -2,
    left: 10,
  },
}))

export const IconContainer: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const ActivitiesIconButton: React.FC<
  React.ComponentProps<typeof MuiIconButton> & { active?: boolean }
> = styled(MuiIconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>({
  variants: [
    {
      props: { active: true },
      style: ({ theme }) => ({
        backgroundColor: `color-mix(in srgb, ${theme.vars.palette.info.main} 8%, transparent)`,
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.info.main} 12%, transparent)`,
        },
        ...theme.applyStyles('dark', {
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.info.main} 12%, transparent)`,
          '&:hover': {
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.info.main} 16%, transparent)`,
          },
        }),
      }),
    },
  ],
})

export const ProgressTrack: React.FC<
  React.ComponentProps<typeof MuiCircularProgress>
> = styled(MuiCircularProgress)(({ theme }) => ({
  position: 'absolute',
  color: theme.vars.palette.grey[300],
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.grey[800],
  }),
}))
