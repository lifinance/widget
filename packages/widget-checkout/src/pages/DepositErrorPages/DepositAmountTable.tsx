import { Box, Stack, Typography } from '@mui/material'
import type { JSX } from 'react'

export interface DepositAmountRow {
  label: string
  value: string
  emphasize?: boolean
}

export function DepositAmountTable({
  rows,
}: {
  rows: DepositAmountRow[]
}): JSX.Element {
  return (
    <Stack
      spacing={1}
      sx={(theme) => ({
        width: '100%',
        padding: theme.spacing(2),
        borderRadius: theme.spacing(1.5),
        backgroundColor: theme.vars.palette.background.paper,
        boxShadow: theme.shadows[1],
      })}
    >
      {rows.map((row) => (
        <Box
          key={row.label}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {row.label}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: row.emphasize ? 700 : 600 }}
          >
            {row.value}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}
