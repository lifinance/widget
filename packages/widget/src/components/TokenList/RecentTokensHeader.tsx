import { Box, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { IconButton } from './TokenList.style.js'

interface RecentTokensHeaderProps {
  atListStart: boolean
  /** Omitted leaves the header in place without the Clear action, so the
   *  band's reserved height always has a header to fill it. */
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
        // ListItem is a flex container, so the header must claim the row width
        // or space-between has nothing to distribute.
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
          // The band reserves the height of a text-only header, so this action
          // must sit on the title's 16px line rather than grow the row.
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
