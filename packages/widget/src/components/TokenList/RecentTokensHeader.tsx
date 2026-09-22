import { Box, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecentTokensStore } from '../../stores/recentTokens/RecentTokensStore.js'
import { IconButton } from './TokenList.style.js'

interface RecentTokensHeaderProps {
  atListStart: boolean
}

export const RecentTokensHeader = ({
  atListStart,
}: RecentTokensHeaderProps): JSX.Element => {
  const { t } = useTranslation()
  // Selecting the action alone keeps this out of every store update.
  const clearRecentTokens = useRecentTokensStore(
    (state) => state.clearRecentTokens
  )

  return (
    <Box
      sx={{
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
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation()
          e.currentTarget.blur()
          clearRecentTokens()
        }}
      >
        {t('button.clear')}
      </IconButton>
    </Box>
  )
}
