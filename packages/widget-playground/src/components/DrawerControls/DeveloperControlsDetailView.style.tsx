import { Box, ButtonBase, styled, Typography } from '@mui/material'
import type { FC } from 'react'

export const Content: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    flex: '1 0 0',
    minHeight: 0,
    overflowY: 'auto',
    padding: theme.spacing(3, 2.5),
  })
)

export const Title: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 700,
  lineHeight: '32px',
  margin: 0,
  marginBottom: theme.spacing(1),
  color: theme.vars.palette.text.primary,
}))

export const ToggleSection: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  width: '100%',
})

export const ToggleItem: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4, 0),
    width: '100%',
  })
)

export const ToggleRow: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    width: '100%',
  })
)

export const ToggleLabel: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  flex: '1 0 0',
  minWidth: 0,
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.vars.palette.text.primary,
}))

export const ToggleDescription: FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
    margin: 0,
    paddingTop: theme.spacing(1.5),
    color: theme.vars.palette.text.secondary,
  }))

export const SubtitleDescription: FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '24px',
    margin: 0,
    color: theme.vars.palette.text.secondary,
  }))

export const SubViewTrack: FC<
  React.ComponentProps<typeof Box> & { showSubView: boolean }
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'showSubView',
})<{ showSubView: boolean }>(({ theme, showSubView }) => ({
  display: 'flex',
  flex: '1 0 0',
  minHeight: 0,
  width: '200%',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.sharp,
  }),
  transform: showSubView ? 'translateX(-50%)' : 'none',
}))

export const SubViewPanel: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: '0 0 50%',
  width: '50%',
  maxWidth: '50%',
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
})

export const ConfigureLink: FC<React.ComponentProps<typeof ButtonBase>> =
  styled(ButtonBase)(({ theme }) => ({
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '18px',
    color: theme.vars.palette.primary.main,
    padding: 0,
    paddingTop: theme.spacing(1.5),
    alignSelf: 'flex-start',
    '&:hover': {
      textDecoration: 'underline',
    },
  }))
