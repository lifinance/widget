import type { ExecutionAction, LiFiStepExtended } from '@lifi/sdk'
import OpenInNew from '@mui/icons-material/OpenInNew'
import type React from 'react'
import { IconCircle } from '../../components/IconCircle/IconCircle.js'
import { useActionMessage } from '../../hooks/useActionMessage.js'
import { ActionRow } from './ActionRow.js'
import { ExternalLink } from './ReceiptsCard.style.js'

export const StepActionRow: React.FC<{
  step: LiFiStepExtended
  action: ExecutionAction
  href: string
  defaultLabelsOnly?: boolean
}> = ({ step, action, href, defaultLabelsOnly }) => {
  const { title } = useActionMessage(step, action, defaultLabelsOnly)
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
