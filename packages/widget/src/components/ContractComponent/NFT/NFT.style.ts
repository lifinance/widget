import { Avatar, styled } from '@mui/material'

export const PreviewAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.vars.palette.background.paper,
  width: 96,
  height: 96,
  borderRadius: theme.vars.shape.borderRadius,
}))
