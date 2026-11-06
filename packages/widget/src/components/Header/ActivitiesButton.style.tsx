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

// The spinner rotates its square box, whose corners would otherwise overflow the header and toggle its scrollbar.
export const ProgressClip: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(() => ({
  position: 'absolute',
  top: -8,
  left: -8,
  width: 40,
  height: 40,
  overflow: 'hidden',
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
  top: 0,
  left: 0,
  color: theme.vars.palette.grey[300],
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.grey[800],
  }),
}))
