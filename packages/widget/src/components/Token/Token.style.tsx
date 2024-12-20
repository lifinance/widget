import { Box, Typography, alpha, styled } from '@mui/material'

export const TextSecondaryContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  flex: 1,
}))

export const TextSecondary = styled(Typography, {
  shouldForwardProp: (prop: string) => !['dot'].includes(prop),
})<{ dot?: boolean }>(({ theme }) => ({
  fontSize: 12,
  lineHeight: 1,
  fontWeight: 500,
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
  variants: [
    {
      props: ({ dot }) => dot,
      style: {
        color: alpha(theme.palette.text.secondary, 0.56),
      },
    },
  ],
}))

export const TokenDivider = styled(Box)(({ theme }) => ({
  height: 16,
  borderLeftWidth: 2,
  borderLeftStyle: 'solid',
  borderColor: theme.palette.grey[800],
  ...theme.applyStyles('light', {
    borderColor: theme.palette.grey[300],
  }),
}))
