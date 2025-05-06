import { Box, Typography, styled } from '@mui/material'

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
  color: theme.vars.palette.text.secondary,
  whiteSpace: 'nowrap',
  variants: [
    {
      props: ({ dot }) => dot,
      style: {
        color: `rgba(${theme.vars.palette.text.secondaryChannel} / 0.56)`,
      },
    },
  ],
}))

export const TokenDivider = styled(Box)(({ theme }) => ({
  height: 16,
  borderLeftWidth: 2,
  borderLeftStyle: 'solid',
  borderColor: theme.vars.palette.grey[300],
  ...theme.applyStyles('dark', {
    borderColor: theme.vars.palette.grey[800],
  }),
}))
