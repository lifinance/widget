import { Box, ButtonBase, styled, Typography } from '@mui/material'
import type { ComponentProps, FC } from 'react'

export const ThemeCardsContainer: FC<ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
})

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
    gap: 24,
    padding: 16,
    borderRadius: 16,
    borderStyle: 'solid',
    borderWidth: selected ? 2 : 1,
    overflow: 'hidden',
    borderColor: selected
      ? theme.vars.palette.primary.main
      : theme.vars.palette.grey[300],
    backgroundColor: theme.vars.palette.background.paper,
    textAlign: 'left',
    transition: theme.transitions.create(['border-color'], {
      duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
      borderColor: selected
        ? theme.vars.palette.primary.main
        : theme.vars.palette.grey[400],
      backgroundColor: theme.vars.palette.background.paper,
    },
    ...theme.applyStyles('dark', {
      borderColor: selected
        ? theme.vars.palette.primary.main
        : theme.vars.palette.grey[700],
      '&:hover': {
        borderColor: selected
          ? theme.vars.palette.primary.main
          : theme.vars.palette.grey[600],
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

export const ThemeName: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.vars.palette.text.primary,
}))

export const EditThemeButton: FC<ComponentProps<'button'>> = styled('button')(
  ({ theme }) => ({
    border: 'none',
    borderRadius: 8,
    padding: '6px 12px',
    minHeight: 28,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '16px',
    backgroundColor: theme.vars.palette.primary.main,
    color: theme.vars.palette.primary.contrastText,
    cursor: 'pointer',
    fontFamily: 'inherit',
  })
)

export const SchemeIcons: FC<ComponentProps<typeof Box>> = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  paddingTop: 6,
  paddingBottom: 6,
})

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

interface ThemePreviewProps {
  previewOutlineColor: string
}

export const ThemePreview: FC<ComponentProps<typeof Box> & ThemePreviewProps> =
  styled(Box, {
    shouldForwardProp: (prop) => prop !== 'previewOutlineColor',
  })<ThemePreviewProps>(({ previewOutlineColor }) => ({
    flex: '0 0 152px',
    width: 152,
    height: 100,
    flexShrink: 0,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `0px 12px 12px -12px rgba(18,18,18,0.04), 0px 6px 6px -3px rgba(18,18,18,0.04), 0px 3px 3px -1.5px rgba(18,18,18,0.04), 0px 1px 1px -0.5px rgba(18,18,18,0.04), 0px 0px 0px 0.5px ${previewOutlineColor}`,
  }))

export const PreviewHeaderPill: FC<ComponentProps<typeof Box>> = styled(Box)({
  position: 'absolute',
  top: 8,
  left: 12,
  width: 41,
  height: 8,
  borderRadius: 80,
})

export const PreviewCard: FC<ComponentProps<typeof Box>> = styled(Box)({
  position: 'absolute',
  top: 22,
  left: 12,
  width: 128,
  height: 46,
  borderRadius: 8,
  overflow: 'hidden',
})

export const PreviewCardText: FC<ComponentProps<typeof Box>> = styled(Box)({
  position: 'absolute',
  top: 5.5,
  left: 5.5,
  width: 16,
  height: 4,
  borderRadius: 80,
})

export const PreviewButton: FC<ComponentProps<typeof Box>> = styled(Box)({
  position: 'absolute',
  top: 74,
  left: 12,
  width: 128,
  height: 14,
  borderRadius: 16,
})
