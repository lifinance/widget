import { Box, styled } from '@mui/material'
import type { FC } from 'react'

export const Content: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  flex: '1 0 0',
  minHeight: 0,
  overflowY: 'auto',
  padding: '24px 20px',
})

export const PageTitle: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 24,
    fontWeight: 700,
    lineHeight: '32px',
    color: theme.vars.palette.text.primary,
    marginBottom: 8,
  })
)

export const PageDescription: FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '24px',
  color: theme.vars.palette.text.secondary,
  marginBottom: 24,
}))

export const SectionHeading: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 16,
    fontWeight: 700,
    lineHeight: '20px',
    color: theme.vars.palette.text.primary,
    marginTop: 24,
    marginBottom: 12,
    '&:first-of-type': {
      marginTop: 0,
    },
  })
)

export const Row: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    minHeight: 56,
    padding: '8px 0',
    borderBottom: `1px solid ${theme.vars.palette.divider}`,
  })
)

export const RowLabel: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '20px',
    color: theme.vars.palette.text.primary,
    flex: '1 0 0',
    minWidth: 0,
  })
)

export const RowValue: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 12,
  flexShrink: 0,
})

export const HexLabel: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    color: theme.vars.palette.text.secondary,
    fontVariantNumeric: 'tabular-nums',
  })
)

export const ModeToggleBox: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    marginBottom: 8,
    '& .MuiToggleButtonGroup-root': {
      backgroundColor: theme.vars.palette.grey[100],
      padding: 4,
      borderRadius: 10,
      gap: 4,
      border: 'none',
    },
    '& .MuiToggleButton-root': {
      border: 'none',
      borderRadius: 8,
      padding: '8px 16px',
      textTransform: 'none',
    },
  })
)

export const SubSection: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  paddingLeft: 0,
  paddingTop: 8,
  paddingBottom: 4,
})

export const SubRow: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '12px 0',
    paddingLeft: 16,
    borderBottom: `1px solid ${theme.vars.palette.divider}`,
  })
)
