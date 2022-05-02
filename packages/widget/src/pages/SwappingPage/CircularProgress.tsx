import { Status } from '@lifinance/sdk';
import {
  Close as CloseIcon,
  Done as DoneIcon,
  PriorityHigh as PriorityHighIcon,
} from '@mui/icons-material';
import { Box, CircularProgress as MuiCircularProgress } from '@mui/material';
import { CircularProgress as CircularProgressStyled } from './CircularProgress.style';

export function CircularProgress({ status }: { status: Status }) {
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
        thickness={3}
        value={100}
      />
      {status === 'PENDING' ? (
        <CircularProgressStyled color="primary" size={32} thickness={3} />
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
