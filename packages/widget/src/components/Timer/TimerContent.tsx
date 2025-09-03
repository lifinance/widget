import AccessTimeFilled from '@mui/icons-material/AccessTimeFilled'
import { Box, Tooltip } from '@mui/material'
import type { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { IconTypography } from '../IconTypography.js'

export const TimerContent: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('tooltip.estimatedTime')} sx={{ cursor: 'help' }}>
      <Box
        component="span"
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 14,
        }}
      >
        <IconTypography as="span" sx={{ marginRight: 0.5, fontSize: 16 }}>
          <AccessTimeFilled fontSize="inherit" />
        </IconTypography>
        <Box
          component="span"
          sx={{
            fontVariantNumeric: 'tabular-nums',
            cursor: 'help',
          }}
        >
          {children}
        </Box>
      </Box>
    </Tooltip>
  )
}
