import { Skeleton, Stack } from '@mui/material'
import type { JSX } from 'react'
import { Card } from '../../../components/Card/Card.js'

export function CheckoutTransactionDetailsSkeleton(): JSX.Element {
  return (
    <>
      <Card variant="elevation" indented>
        <Stack spacing={1.5}>
          <Skeleton variant="text" width={180} height={20} />
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="text" width="40%" height={16} />
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Skeleton variant="text" width="55%" height={28} />
              <Skeleton variant="text" width="35%" height={16} />
            </Stack>
          </Stack>
        </Stack>
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Skeleton variant="rounded" height={40} />
          <Skeleton variant="rounded" height={40} />
          <Skeleton variant="rounded" height={40} />
        </Stack>
      </Card>
      <Card variant="elevation" indented>
        <Stack spacing={1}>
          <Skeleton variant="text" width={120} height={20} />
          <Skeleton variant="text" width="70%" height={16} />
        </Stack>
      </Card>
      <Skeleton variant="rounded" height={48} sx={{ mt: 1.5 }} />
    </>
  )
}
