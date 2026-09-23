import { Box, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { IconButton } from './TokenList.style.js'

interface RecentTokensHeaderProps {
  atListStart: boolean
  /** Omitted: the header still renders, without the Clear action. */
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
        <IconButton
          size="small"
          // Match the title's 16px line; the band reserves only that height.
          sx={{ py: 0, lineHeight: '16px' }}
          onClick={(e) => {
            e.stopPropagation()
            e.currentTarget.blur()
            onClear()
          }}
        >
          {t('button.clear')}
        </IconButton>
      ) : null}
    </Box>
  )
}
