import {
  Box,
  ButtonBase,
  Tab as MuiTab,
  Tabs as MuiTabs,
  styled,
  Typography,
  tabClasses,
  tabsClasses,
} from '@mui/material'
import type { FC } from 'react'
import { getCardFieldsetBackgroundColor } from '../../utils/color.js'

export const SectionLabel: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  display: 'block',
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.vars.palette.text.secondary,
  marginBottom: theme.spacing(1),
}))

export const MethodHint: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  margin: 0,
  marginTop: theme.spacing(1.5),
  color: theme.vars.palette.text.secondary,
}))

export const OptionButton: FC<
  React.ComponentProps<typeof ButtonBase> & { selected: boolean }
> = styled(
  (props: React.ComponentProps<typeof ButtonBase> & { selected: boolean }) => (
    <ButtonBase {...props} disableRipple />
  ),
  {
    shouldForwardProp: (prop) => prop !== 'selected',
  }
)<{ selected: boolean }>(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: 44,
  padding: theme.spacing(1.25, 2),
  borderRadius: 8,
  border: '1px solid',
  borderColor: selected
    ? theme.vars.palette.primary.main
    : theme.vars.palette.grey[300],
  backgroundColor: theme.vars.palette.background.paper,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.vars.palette.text.primary,
  textAlign: 'center',
  transition: theme.transitions.create('border-color', {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    borderColor: selected
      ? theme.vars.palette.primary.main
      : `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 32%, transparent)`,
  },
  ...theme.applyStyles('dark', {
    borderColor: selected
      ? theme.vars.palette.primary.main
      : theme.vars.palette.grey[800],
    '&:hover': {
      borderColor: selected
        ? theme.vars.palette.primary.main
        : `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 48%, transparent)`,
    },
  }),
}))

export const PresetStack: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
  })
)

export const FormBlock: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

export const MethodTabs: FC<React.ComponentProps<typeof MuiTabs>> = styled(
  MuiTabs
)(({ theme }) => ({
  ...getCardFieldsetBackgroundColor(theme),
  borderRadius: Math.max(
    theme.shape.borderRadius,
    theme.shape.borderRadiusSecondary
  ),
  padding: theme.spacing(0.5),
  minHeight: 48,
  [`.${tabsClasses.indicator}`]: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius:
      Math.max(theme.shape.borderRadius, theme.shape.borderRadiusSecondary) - 4,
    boxShadow: `0px 2px 4px color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.vars.palette.background.default,
      boxShadow: `0px 2px 4px color-mix(in srgb, ${theme.vars.palette.common.background} 4%, transparent)`,
    }),
  },
}))

export const MethodTab: FC<React.ComponentProps<typeof MuiTab>> = styled(
  MuiTab
)(({ theme }) => ({
  zIndex: 1,
  flex: 1,
  textTransform: 'none',
  fontSize: 14,
  fontWeight: 500,
  minHeight: 40,
  color: theme.vars.palette.common.onBackground,
  [`&.${tabClasses.selected}`]: {
    color: theme.vars.palette.common.onBackground,
  },
}))
