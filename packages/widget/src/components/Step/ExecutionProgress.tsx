import type { RouteExtended } from '@lifi/sdk'
import { Box, Typography } from '@mui/material'
import { useActionMessage } from '../../hooks/useActionMessage.js'
import { CircularProgress } from './CircularProgress.js'

export const ExecutionProgress: React.FC<{
  route: RouteExtended
}> = ({ route }) => {
  const lastStep = route.steps.at(-1)
  const lastAction = lastStep?.execution?.actions?.at(-1)
  const { title, message } = useActionMessage(lastStep, lastAction)

  if (!lastStep || !lastAction) {
    return null
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress step={lastStep} />
      </Box>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 500,
          color: 'text.primary',
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>
      {message ? (
        <Typography
          sx={{
            fontSize: 12,
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          {message}
        </Typography>
      ) : null}
    </Box>
  )
}
