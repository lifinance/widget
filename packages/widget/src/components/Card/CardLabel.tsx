import { Box, Typography, styled } from '@mui/material'

export const CardLabel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: 'secondary' | 'success' }>(({ theme }) => ({
  borderRadius: theme.vars.shape.borderRadius,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 24,
  minWidth: 24,
  userSelect: 'none',
  fontSize: '1rem',
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 88%, black)`,
  color: theme.vars.palette.text.primary,
  ...theme.applyStyles('dark', {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 84%, white)`,
  }),
  variants: [
    {
      props: { variant: 'secondary' },
      style: {
        color: theme.palette.getContrastText(theme.palette.secondary.main),
        backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 20%, ${theme.vars.palette.secondary.main})`,
        ...theme.applyStyles('dark', {
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 20%, ${theme.vars.palette.secondary.main})`,
        }),
      },
    },
    {
      props: { variant: 'success' },
      style: {
        backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 84%, ${theme.vars.palette.success.main})`,
        color: theme.vars.palette.success.main,
        ...theme.applyStyles('dark', {
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 76%, ${theme.vars.palette.success.main})`,
          color: `color-mix(in srgb, ${theme.vars.palette.success.main} 76%, white)`,
        }),
      },
    },
  ],
}))

export const CardLabelTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'type',
})<{ type?: 'icon' }>(({ theme }) => ({
  padding: theme.spacing(0.75, 1.5),
  fontSize: 12,
  lineHeight: 1,
  fontWeight: '600',
  variants: [
    {
      props: {
        type: 'icon',
      },
      style: {
        padding: theme.spacing(0.75, 0, 0.75, 0.75),
      },
    },
  ],
}))
