import type { ProcessStatus, Substatus } from '@lifi/sdk'
import type { Theme } from '@mui/material'
import {
  Box,
  circularProgressClasses,
  keyframes,
  CircularProgress as MuiCircularProgress,
  styled,
} from '@mui/material'

const getStatusColor = (
  theme: Theme,
  status?: ProcessStatus,
  substatus?: Substatus
) => {
  switch (status) {
    case 'ACTION_REQUIRED':
    case 'MESSAGE_REQUIRED':
    case 'RESET_REQUIRED':
      return `rgba(${theme.vars.palette.info.mainChannel} / 0.12)`
    case 'DONE':
      if (substatus === 'PARTIAL' || substatus === 'REFUNDED') {
        return `rgba(${theme.vars.palette.warning.mainChannel} / 0.48)`
      }
      return `rgba(${theme.vars.palette.success.mainChannel} / 0.12)`
    case 'FAILED':
      return `rgba(${theme.vars.palette.error.mainChannel} / 0.12)`
    default:
      return null
  }
}

export const CircularIcon = styled(Box, {
  shouldForwardProp: (prop: string) => !['status', 'substatus'].includes(prop),
})<{ status?: ProcessStatus; substatus?: Substatus }>(
  ({ theme, status, substatus }) => {
    const statusColor = getStatusColor(theme, status, substatus)
    const isSpecialStatus = [
      'ACTION_REQUIRED',
      'MESSAGE_REQUIRED',
      'RESET_REQUIRED',
      'DONE',
      'FAILED',
    ].includes(status!)

    return {
      backgroundColor: isSpecialStatus
        ? statusColor!
        : theme.vars.palette.background.paper,
      borderStyle: 'solid',
      borderColor: statusColor || theme.vars.palette.grey[300],
      borderWidth: !isSpecialStatus ? 3 : 0,
      display: 'grid',
      position: 'relative',
      placeItems: 'center',
      width: 40,
      height: 40,
      borderRadius: '50%',
      ...theme.applyStyles('dark', {
        borderColor: statusColor || theme.vars.palette.grey[800],
      }),
    }
  }
)

const circleAnimation = keyframes`
  0% {
    stroke-dashoffset: 129;
    transform: rotate(0);
  }
  50% {
    stroke-dashoffset: 56;
    transform: rotate(45deg);
  };
  100% {
    stroke-dashoffset: 129;
    transform: rotate(360deg);
  }
`

// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
export const CircularProgressPending = styled(MuiCircularProgress)`
  color: ${({ theme }) => theme.vars.palette.primary.main};
  ${({ theme }) =>
    theme.applyStyles('dark', {
      color: theme.vars.palette.primary.light,
    })}
  animation-duration: 3s;
  position: absolute;
  .${circularProgressClasses.circle} {
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-name: ${circleAnimation};
    stroke-dasharray: 129;
    stroke-dashoffset: 129;
    stroke-linecap: round;
    transform-origin: 100% 100%;
  }
`
