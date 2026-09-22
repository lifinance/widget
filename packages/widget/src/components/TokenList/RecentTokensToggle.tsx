import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { IconButton } from './TokenList.style.js'

interface RecentTokensToggleProps {
  expanded: boolean
  hiddenCount: number
  onToggle: () => void
}

export const RecentTokensToggle = ({
  expanded,
  hiddenCount,
  onToggle,
}: RecentTokensToggleProps): JSX.Element => {
  const { t } = useTranslation()
  const ExpandIcon = expanded ? ExpandLessIcon : ExpandMoreIcon

  return (
    <Box sx={{ display: 'flex', px: 1.5, pt: 1 }}>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation()
          e.currentTarget.blur()
          onToggle()
        }}
      >
        {expanded
          ? t('button.showLess')
          : t('button.showMore', { count: hiddenCount })}
        <ExpandIcon />
      </IconButton>
    </Box>
  )
}
