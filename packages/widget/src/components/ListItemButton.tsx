import {
  ListItemButton as MuiListItemButton,
  listItemButtonClasses,
  styled,
} from '@mui/material'

export const ListItemButton = styled(MuiListItemButton)(({ theme }) => {
  return {
    borderRadius: theme.vars.shape.borderRadius,
    paddingLeft: theme.spacing(1.5),
    height: 56,
    '&:hover': {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    },
    [`&.${listItemButtonClasses.selected}`]: {
      backgroundColor: `color-mix(in srgb, ${theme.vars.palette.secondary.main} 15%, white)`,
      '&:hover': {
        backgroundColor: `color-mix(in srgb, ${theme.vars.palette.secondary.main} 20%, white)`,
      },
      ...theme.applyStyles('dark', {
        backgroundColor: `color-mix(in srgb, ${theme.vars.palette.secondary.main} 24%, black)`,
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.secondary.main} 28%, black)`,
        },
      }),
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
