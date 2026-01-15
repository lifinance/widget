import type { ExecutionStatus, Substatus } from '@lifi/sdk'
import { Box, styled } from '@mui/material'
import { getStatusColor } from '../../utils/getStatusColor'

export const CircularIcon = styled(Box, {
  shouldForwardProp: (prop: string) => !['status', 'substatus'].includes(prop),
})<{ status?: ExecutionStatus; substatus?: Substatus }>(
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
