import { Box, Card, CardContent, Chip, styled } from '@mui/material'

export const Root = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: `1px solid ${theme.vars?.palette?.divider ?? theme.palette.divider}`,
  '&:hover': {
    borderColor:
      theme.vars?.palette?.primary?.main ?? theme.palette.primary.main,
    backgroundColor:
      theme.vars?.palette?.action?.hover ?? theme.palette.action.hover,
  },
}))

export const Content = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}))

export const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: 8,
  backgroundColor: theme.vars?.palette?.grey?.[200] ?? theme.palette.grey[200],
  fontWeight: 700,
  fontSize: 14,
  color: theme.vars?.palette?.text?.primary ?? theme.palette.text.primary,
}))

export const FeatureList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
}))

export const TextColumn = styled(Box)({
  flex: 1,
})

export const TitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}))

export const RecommendedChip = styled(Chip)({
  height: 20,
  fontSize: 11,
})

export const FeatureChip = styled(Chip)({
  height: 22,
  fontSize: 11,
})
