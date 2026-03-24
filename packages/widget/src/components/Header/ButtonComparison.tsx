import ErrorRounded from '@mui/icons-material/ErrorRounded'
import ReceiptLong from '@mui/icons-material/ReceiptLong'
import {
  Box,
  IconButton,
  CircularProgress as MuiCircularProgress,
  Stack,
  styled,
} from '@mui/material'
import { CircularProgressPending } from '../Step/CircularProgress.style.js'
import { ErrorBadge } from './ActivitiesButton.style.js'

const ProgressTrack = styled(MuiCircularProgress)(({ theme }) => ({
  position: 'absolute',
  color: theme.vars.palette.grey[300],
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.grey[800],
  }),
}))

const ProgressFill = styled(MuiCircularProgress)(({ theme }) => ({
  position: 'absolute',
  color: theme.vars.palette.primary.main,
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.primary.light,
  }),
}))

const errorBadgeContent = (
  <ErrorRounded color="error" sx={{ width: 20, height: 20 }} />
)

const VariantA = () => (
  <IconButton size="medium">
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ProgressTrack
        variant="determinate"
        value={100}
        size={40}
        thickness={3}
      />
      <CircularProgressPending
        size={40}
        sx={{ position: 'absolute', top: -8, left: -8 }}
      />
      <ReceiptLong />
    </Box>
  </IconButton>
)

const VariantAError = () => (
  <IconButton size="medium">
    <ErrorBadge
      badgeContent={errorBadgeContent}
      overlap="circular"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ProgressTrack
          variant="determinate"
          value={100}
          size={40}
          thickness={3}
        />
        <CircularProgressPending
          size={40}
          sx={{ position: 'absolute', top: -8, left: -8 }}
        />
        <ReceiptLong />
      </Box>
    </ErrorBadge>
  </IconButton>
)

const VariantB = () => (
  <IconButton size="medium">
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ProgressTrack
        variant="determinate"
        value={100}
        size={40}
        thickness={3}
      />
      <ProgressFill variant="determinate" value={25} size={40} thickness={3} />
      <ReceiptLong />
    </Box>
  </IconButton>
)

const VariantBError = () => (
  <IconButton size="medium">
    <ErrorBadge
      badgeContent={errorBadgeContent}
      overlap="circular"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ProgressTrack
          variant="determinate"
          value={100}
          size={40}
          thickness={3}
        />
        <ProgressFill
          variant="determinate"
          value={25}
          size={40}
          thickness={3}
        />
        <ReceiptLong />
      </Box>
    </ErrorBadge>
  </IconButton>
)

const VariantCError = () => (
  <IconButton size="medium">
    <ErrorBadge
      badgeContent={errorBadgeContent}
      overlap="circular"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ProgressTrack
          variant="determinate"
          value={100}
          size={40}
          thickness={3}
        />
        <ReceiptLong />
      </Box>
    </ErrorBadge>
  </IconButton>
)

export const ButtonComparison = () => (
  <Stack direction="row" alignItems="flex-end" spacing={3} sx={{ mx: 2 }}>
    <VariantA />
    <VariantAError />
    <VariantB />
    <VariantBError />
    <VariantCError />
  </Stack>
)
