import { Badge, Box, IconButton as MuiIconButton, styled } from '@mui/material'
import type React from 'react'

export const progressRingSize = 40

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

export const ProgressRing: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: progressRingSize,
  height: progressRingSize,
  margin: -progressRingSize / 2,
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
