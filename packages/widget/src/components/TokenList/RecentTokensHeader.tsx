import { Box, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FooterText,
  ToggleButton,
} from '../AmountInputCard/AmountInputCard.style.js'

interface RecentTokensHeaderProps {
  atListStart: boolean
  onClear?: () => void
}

export const RecentTokensHeader = ({
  atListStart,
  onClear,
}: RecentTokensHeaderProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        // ListItem is a flex container; claim the width for space-between.
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 1.5,
        pt: atListStart ? 0 : 1,
        pb: 1,
      }}
    >
      <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: '16px' }}>
        {t('main.recentSearches')}
      </Typography>
      {onClear ? (
        <ToggleButton
          clickable
          // Right-aligned, so the padding hangs past the right edge instead.
          sx={{ px: 0.75, ml: 0, mr: -0.75 }}
          onClick={(e) => {
            e.stopPropagation()
            e.currentTarget.blur()
            onClear()
          }}
        >
          <FooterText>{t('button.clear')}</FooterText>
        </ToggleButton>
      ) : null}
    </Box>
  )
}
