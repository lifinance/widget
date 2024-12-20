import {
  ListItemButton as MuiListItemButton,
  alpha,
  styled,
} from '@mui/material'

export const ListItemButton = styled(MuiListItemButton)(({ theme }) => {
  const backgroundHoverColor =
    theme.palette.mode === 'light'
      ? alpha(theme.palette.common.black, 0.04)
      : alpha(theme.palette.common.white, 0.04)
  return {
    borderRadius: theme.shape.borderRadius,
    paddingLeft: theme.spacing(1.5),
    height: 56,
    '&:hover': {
      backgroundColor: backgroundHoverColor,
    },
    variants: [
      {
        props: ({ disabled }) => disabled,
        style: {
          opacity: 0.5,
          cursor: 'auto',
          '&:hover': {
            backgroundColor: 'none',
          },
        },
      },
    ],
  }
})
