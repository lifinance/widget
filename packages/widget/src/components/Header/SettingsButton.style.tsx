import {
  badgeClasses,
  IconButton,
  Badge as MuiBadge,
  styled,
} from '@mui/material'
import type React from 'react'

export const SettingsIconBadge: React.FC<
  React.ComponentProps<typeof MuiBadge>
> = styled(MuiBadge)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  [`.${badgeClasses.badge}`]: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    transform: 'translate(70%, -70%)',
  },
}))

interface SettingsIconButtonProps {
  variant?: 'info' | 'warning'
}

export const SettingsIconButton: React.FC<
  React.ComponentProps<typeof IconButton> & SettingsIconButtonProps
> = styled(IconButton, {
  shouldForwardProp: (props) => props !== 'variant',
})<SettingsIconButtonProps>(({ theme, variant }) => {
  switch (variant) {
    case 'info':
      return {
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
      }
    case 'warning':
      return {
        backgroundColor: `color-mix(in srgb, ${theme.vars.palette.warning.main} 32%, transparent)`,
        '&:hover': {
          backgroundColor: `color-mix(in srgb, color-mix(in srgb, ${theme.vars.palette.warning.main} 32%, transparent) 80%, black)`,
        },
        ...theme.applyStyles('dark', {
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.warning.main} 16%, transparent)`,
          '&:hover': {
            backgroundColor: `color-mix(in srgb, color-mix(in srgb, ${theme.vars.palette.warning.main} 16%, transparent) 80%, black)`,
          },
        }),
      }
    default:
      return {}
  }
})
