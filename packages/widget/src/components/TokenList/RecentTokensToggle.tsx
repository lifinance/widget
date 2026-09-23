import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FooterText,
  ToggleButton,
} from '../AmountInputCard/AmountInputCard.style.js'

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
    // 2 + 18 + 8 fills the reserved 28px: close to the band, clear of the next header.
    <Box sx={{ width: '100%', display: 'flex', px: 1.5, pt: 0.25, pb: 1 }}>
      <ToggleButton
        clickable
        onClick={(e) => {
          e.stopPropagation()
          e.currentTarget.blur()
          onToggle()
        }}
      >
        <FooterText>
          {expanded
            ? t('button.showLess')
            : t('button.showMore', { count: hiddenCount })}
        </FooterText>
        <ExpandIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
      </ToggleButton>
    </Box>
  )
}
