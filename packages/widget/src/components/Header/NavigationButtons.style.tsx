import { Box, buttonClasses, Button as MuiButton, styled } from '@mui/material'

export const NavigationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  borderRadius: theme.vars.shape.borderRadius,
}))

export const NavigationButton = styled(MuiButton)(({ theme }) => ({
  padding: theme.spacing(1, 2.5),
  borderRadius: theme.vars.shape.borderRadius,
  fontWeight: 700,
  lineHeight: 1.25,
  color: theme.vars.palette.common.onBackground,
  fontSize: '1rem',
  border: 'none',
  height: theme.spacing(5),
  transition: 'background-color 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
  '&:hover': {
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    color: theme.vars.palette.common.onBackground,
    ...theme.applyStyles('dark', {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
    }),
  },
  [`&.${buttonClasses.text}`]: {
    backgroundColor: 'transparent',
  },
  [`&.${buttonClasses.contained}`]: {
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    ...theme.applyStyles('dark', {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
    }),
  },
}))
