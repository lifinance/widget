import { ListItemButton as MuiListItemButton, styled } from '@mui/material'
import { getContrastAlphaColor } from '../utils/colors.js'

export const ListItemButton = styled(MuiListItemButton)(({ theme }) => {
  const backgroundHoverColor = getContrastAlphaColor(theme, 0.04)
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
