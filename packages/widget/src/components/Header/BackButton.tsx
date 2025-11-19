import ArrowBack from '@mui/icons-material/ArrowBack'
import { IconButton, useTheme } from '@mui/material'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useHeaderStore } from '../../stores/header/useHeaderStore.js'

export const BackButton: React.FC = () => {
  const theme = useTheme()
  const navigateBack = useNavigateBack()
  const [backAction, executeBackAction] = useHeaderStore((state) => [
    state.backAction,
    state.executeBackAction,
  ])

  return (
    <IconButton
      size="medium"
      edge={theme?.navigation?.edge ? 'start' : false}
      onClick={() => {
        if (backAction) {
          executeBackAction()
        } else {
          navigateBack()
        }
      }}
    >
      <ArrowBack />
    </IconButton>
  )
}
