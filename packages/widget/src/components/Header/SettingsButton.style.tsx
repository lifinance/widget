import {
  IconButton,
  Badge as MuiBadge,
  badgeClasses,
  styled,
} from '@mui/material'

export const SettingsIconBadge = styled(MuiBadge)(({ theme }) => ({
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

export const SettingsIconButton = styled(IconButton, {
  shouldForwardProp: (props) => props !== 'variant',
})<SettingsIconButtonProps>(({ theme, variant }) => {
  switch (variant) {
    case 'info':
      return {
        backgroundColor: `rgba(${theme.vars.palette.info.mainChannel} / 0.12)`,
        '&:hover': {
          backgroundColor: `color-mix(in srgb, rgba(${theme.vars.palette.info.mainChannel} / 0.12) 80%, black)`,
        },
        ...theme.applyStyles('dark', {
          backgroundColor: `rgba(${theme.vars.palette.info.mainChannel} / 0.16)`,
          '&:hover': {
            backgroundColor: `color-mix(in srgb, rgba(${theme.vars.palette.info.mainChannel} / 0.16) 80%, black)`,
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
