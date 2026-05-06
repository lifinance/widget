import type { FullStatusData, StatusResponse } from '@lifi/sdk'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { type JSX, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../../components/Card/Card.js'
import { StatusStepList } from './StatusStepList.js'

interface StatusExecutingProps {
  status: StatusResponse | undefined
}

const RING_SIZE = 96

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function StatusExecuting({ status }: StatusExecutingProps): JSX.Element {
  const { t } = useTranslation()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setElapsed((v) => v + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const fullStatus = status as FullStatusData | undefined

  return (
    <Stack spacing={2} sx={{ flex: 1 }}>
      <Card variant="elevation" indented sx={{ filter: 'none' }}>
        <Stack
          spacing={3}
          sx={{ alignItems: 'center', textAlign: 'center', py: 3 }}
        >
          <Box
            sx={{
              position: 'relative',
              width: RING_SIZE,
              height: RING_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            <Typography
              variant="h6"
              sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}
            >
              {formatElapsed(elapsed)}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.primary">
            {t('checkout.transactionStatus.executing')}
          </Typography>
        </Stack>
        {fullStatus ? (
          <Box sx={{ pt: 2 }}>
            <StatusStepList status={fullStatus} phase="pending" />
          </Box>
        ) : null}
      </Card>
    </Stack>
  )
}
