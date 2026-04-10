import type { ExecutionAction, LiFiStepExtended } from '@lifi/sdk'
import OpenInNew from '@mui/icons-material/OpenInNew'
import type React from 'react'
import { useActionMessage } from '../../hooks/useActionMessage.js'
import { ActionRow } from '../ActionRow/ActionRow.js'
import { IconCircle } from '../IconCircle/IconCircle.js'
import { ExternalLink } from './StepActionRow.style.js'

export const StepActionRow: React.FC<{
  step: LiFiStepExtended
  action: ExecutionAction
  href: string
}> = ({ step, action, href }) => {
  const { title } = useActionMessage(step, action)
  const isFailed = action?.status === 'FAILED'
  return (
    <ActionRow
      startAdornment={
        <IconCircle status={isFailed ? 'error' : 'success'} size={24} />
      }
      message={title ?? ''}
      endAdornment={
        <ExternalLink href={href} target="_blank" rel="nofollow noreferrer">
          <OpenInNew sx={{ fontSize: 16 }} />
        </ExternalLink>
      }
    />
  )
}
