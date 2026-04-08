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
        backgroundColor: `rgba(${theme.vars.palette.info.mainChannel} / 0.08)`,
        '&:hover': {
          backgroundColor: `rgba(${theme.vars.palette.info.mainChannel} / 0.12)`,
        },
        ...theme.applyStyles('dark', {
          backgroundColor: `rgba(${theme.vars.palette.info.mainChannel} / 0.12)`,
          '&:hover': {
            backgroundColor: `rgba(${theme.vars.palette.info.mainChannel} / 0.16)`,
          },
        }),
      }
    case 'warning':
      return {
        backgroundColor: `rgba(${theme.vars.palette.warning.mainChannel} / 0.32)`,
        '&:hover': {
          backgroundColor: `color-mix(in srgb, rgba(${theme.vars.palette.warning.mainChannel} / 0.32) 80%, black)`,
        },
        ...theme.applyStyles('dark', {
          backgroundColor: `rgba(${theme.vars.palette.warning.mainChannel} / 0.16)`,
          '&:hover': {
            backgroundColor: `color-mix(in srgb, rgba(${theme.vars.palette.warning.mainChannel} / 0.16) 80%, black)`,
          },
        }),
      }
    default:
      return {}
  }
})
