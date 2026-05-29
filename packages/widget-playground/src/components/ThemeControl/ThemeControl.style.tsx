import { Box, ButtonBase, styled, Typography } from '@mui/material'
import type { ComponentProps, FC } from 'react'

export const ThemeCardsContainer: FC<ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  })
)

interface ThemeCardProps {
  selected: boolean
}

export const ThemeCard: FC<ComponentProps<typeof ButtonBase> & ThemeCardProps> =
  styled(ButtonBase, {
    shouldForwardProp: (prop) => prop !== 'selected',
  })<ThemeCardProps>(({ theme, selected }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(3),
    padding: theme.spacing(2),
    borderRadius: 16,
    border: '1px solid',
    overflow: 'hidden',
    cursor: 'pointer',
    borderColor: selected
      ? theme.vars.palette.primary.main
      : theme.vars.palette.divider,
    backgroundColor: theme.vars.palette.background.paper,
    textAlign: 'left',
    transition: theme.transitions.create(['border-color'], {
      duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
      borderColor: selected
        ? theme.vars.palette.primary.main
        : `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 32%, transparent)`,
      backgroundColor: theme.vars.palette.background.paper,
    },
    ...theme.applyStyles('dark', {
      borderColor: selected
        ? theme.vars.palette.primary.main
        : theme.vars.palette.divider,
      '&:hover': {
        borderColor: selected
          ? theme.vars.palette.primary.main
          : `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 48%, transparent)`,
      },
    }),
  }))

export const ThemeCardInfo: FC<ComponentProps<typeof Box>> = styled(Box)({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flex: '1 0 0',
  alignSelf: 'stretch',
})

export const ThemeName: FC<ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.vars.palette.text.primary,
}))

export const EditThemeAction: FC<
  ComponentProps<'span'> & {
    onClick?: React.MouseEventHandler<HTMLSpanElement>
    onKeyDown?: React.KeyboardEventHandler<HTMLSpanElement>
  }
> = styled('span')(({ theme }) => ({
  border: 'none',
  borderRadius: 8,
  padding: theme.spacing(0.75, 1.5),
  minHeight: 28,
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '16px',
  backgroundColor: theme.vars.palette.primary.main,
  color: theme.vars.palette.primary.contrastText,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    backgroundColor: theme.vars.palette.primary.dark,
  },
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const SchemeIcons: FC<ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    padding: theme.spacing(0.75, 0),
  })
)

export const SchemeIconSlot: FC<ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.vars.palette.text.secondary,
    width: 20,
    height: 20,
    '& > svg': {
      fontSize: 20,
    },
  })
)
