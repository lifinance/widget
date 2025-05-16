import { ListItemButton as MuiListItemButton, styled } from '@mui/material'

export const ListItemButton = styled(MuiListItemButton)(({ theme }) => {
  return {
    borderRadius: theme.vars.shape.borderRadius,
    paddingLeft: theme.spacing(1.5),
    height: 56,
    '&:hover': {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
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
