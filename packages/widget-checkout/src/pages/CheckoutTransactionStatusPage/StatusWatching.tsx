import { Card, PoweredBy } from '@lifi/widget/shared'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'

const RING_SIZE = 96

export function StatusWatching(): JSX.Element {
  const { t } = useTranslation()
  return (
    <Stack spacing={2} sx={{ flex: 1 }}>
      <Card
        type="default"
        indented
        variant="elevation"
        elevation={0}
        sx={{ filter: 'none' }}
      >
        <Stack
          spacing={4}
          sx={{ alignItems: 'center', textAlign: 'center', py: 5 }}
        >
          <Box
            sx={{
              position: 'relative',
              width: RING_SIZE,
              height: RING_SIZE,
            }}
          >
            <CircularProgress
              variant="determinate"
              value={100}
              size={RING_SIZE}
              thickness={2}
              sx={(theme) => ({
                color: theme.vars.palette.grey[100],
                position: 'absolute',
                left: 0,
                top: 0,
              })}
            />
            <CircularProgress
              variant="indeterminate"
              size={RING_SIZE}
              thickness={2}
              disableShrink
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                animationDuration: '3s',
                color: 'primary.main',
                '& .MuiCircularProgress-circle': {
                  strokeDasharray: '14px, 200px',
                  strokeLinecap: 'round',
                },
              }}
            />
          </Box>
          <Typography variant="body1" color="text.secondary">
            {t('checkout.transactionStatus.watching')}
          </Typography>
        </Stack>
      </Card>
      <PoweredBy />
    </Stack>
  )
}
