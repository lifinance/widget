import { Box, styled } from '@mui/material'
import type { FC } from 'react'

export const Row: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: 12,
    border: '1px solid',
    borderColor: theme.vars.palette.divider,
    backgroundColor: theme.vars.palette.background.paper,
    transition: 'border-color 0.15s',
    '&:hover': {
      borderColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 24%, transparent)`,
    },
    '&:focus-within': {
      borderColor: theme.vars.palette.primary.main,
    },
  })
)

export const RowLabel: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '18px',
    color: theme.vars.palette.text.secondary,
    flex: '1 0 0',
    minWidth: 0,
  })
)

export const RowValue: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1.5),
    flexShrink: 0,
  })
)

export const SubSection: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    paddingLeft: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
  })
)

export const SubRow: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1, 0),
  })
)

export const ToggleRow: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  })
)

export const ToggleRowLabel: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '20px',
    color: theme.vars.palette.text.primary,
    flex: '1 0 0',
    minWidth: 0,
  })
)

export const ClickableRow: FC<React.ComponentProps<typeof Row>> = styled(Row)({
  cursor: 'pointer',
})
