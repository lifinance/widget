import { Button, styled } from '@mui/material'

export const InputPriceButton = styled(Button)(({ theme, onClick }) => ({
  color: theme.vars.palette.text.secondary,
  padding: theme.spacing(0.25, 0.5, 0.25, 0.75),
  maxHeight: 16,
  fontSize: '0.75rem',
  fontWeight: 500,
  borderRadius: `calc(${theme.vars.shape.borderRadius} * 2)`,
  backgroundColor: 'transparent',
  minWidth: 32,
  ...(onClick
    ? {
        '&:hover': {
          backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
        },
        ...theme.applyStyles('dark', {
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
          },
        }),
      }
    : {
        cursor: 'text',
        userSelect: 'text',
        pointerEvents: 'none',
      }),
}))
