import { Status } from '@lifinance/sdk';
import {
  Close as CloseIcon,
  Done as DoneIcon,
  PriorityHigh as PriorityHighIcon,
} from '@mui/icons-material';
import { Box, CircularProgress as MuiCircularProgress } from '@mui/material';
import { CircularProgressProps } from '@mui/material/CircularProgress';

export function CircularProgress({
  status,
  ...props
}: { status: Status } & CircularProgressProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        position: 'relative',
        placeItems: 'center',
      }}
    >
      <MuiCircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
        }}
        size={32}
        thickness={5}
        value={100}
        {...props}
      />
      {status === 'PENDING' ? (
        <MuiCircularProgress
          color="primary"
          sx={{
            position: 'absolute',
            left: 0,
          }}
          size={32}
          thickness={5}
        />
      ) : null}
      {status === 'ACTION_REQUIRED' ? (
        <PriorityHighIcon
          color="warning"
          sx={{
            position: 'absolute',
            fontSize: '1rem',
          }}
        />
      ) : null}
      {status === 'DONE' ? (
        <DoneIcon
          color="success"
          sx={{
            position: 'absolute',
            fontSize: '1rem',
          }}
        />
      ) : null}
      {status === 'FAILED' ? (
        <CloseIcon
          color="error"
          sx={{
            position: 'absolute',
            fontSize: '1rem',
          }}
        />
      ) : null}
    </Box>
  );
}
