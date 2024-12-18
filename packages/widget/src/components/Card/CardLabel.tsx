import { Box, Typography, getContrastRatio, styled } from '@mui/material'
import { blend } from '../../utils/colors.js'

export const CardLabel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'type',
})<{ type?: 'active' }>(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 24,
  minWidth: 24,
  userSelect: 'none',
  fontSize: '1rem',
  marginRight: theme.spacing(1),
  backgroundColor: blend(
    theme.palette.background.paper,
    theme.palette.common.white,
    0.16
  ),
  color: theme.palette.text.primary,
  ...theme.applyStyles('light', {
    backgroundColor: blend(
      theme.palette.background.paper,
      theme.palette.common.black,
      0.12
    ),
  }),
  variants: [
    {
      props: { type: 'active' },
      style: {
        backgroundColor: blend(
          theme.palette.background.paper,
          theme.palette.secondary.main,
          0.8
        ),
        color:
          getContrastRatio(
            theme.palette.common.white,
            blend(
              theme.palette.background.paper,
              theme.palette.secondary.main,
              0.8
            )
          ) >= 3
            ? theme.palette.common.white
            : theme.palette.common.black,
        ...theme.applyStyles('light', {
          backgroundColor: theme.palette.secondary.main,
          color:
            getContrastRatio(
              theme.palette.common.white,
              theme.palette.secondary.main
            ) >= 3
              ? theme.palette.common.white
              : theme.palette.common.black,
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
