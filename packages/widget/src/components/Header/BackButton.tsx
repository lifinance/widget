import { ArrowBack } from '@mui/icons-material'
import type { IconButtonProps } from '@mui/material'
import { IconButton, useTheme } from '@mui/material'

export const BackButton: React.FC<IconButtonProps> = ({ onClick }) => {
  const theme = useTheme()

  return (
    <IconButton
      size="medium"
      edge={theme?.navigation?.edge ? 'start' : false}
      onClick={onClick}
    >
      <ArrowBack />
    </IconButton>
  )
}
