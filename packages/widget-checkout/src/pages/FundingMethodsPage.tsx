import { Box, Card, CardContent, Chip, styled, Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { checkoutNavigationRoutes } from '../utils/navigationRoutes.js'

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  flex: 1,
}))

const MethodCard = styled(Card)(({ theme }) => ({
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

const MethodContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}))

const ProviderLogo = styled(Box)(({ theme }) => ({
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

const FeatureList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
}))

interface FundingProvider {
  id: string
  name: string
  description: string
  features: string[]
  recommended?: boolean
}

const DEFAULT_PROVIDERS: FundingProvider[] = [
  {
    id: 'transak',
    name: 'Transak',
    description: 'Buy crypto with card or bank transfer',
    features: ['Visa/Mastercard', 'Bank Transfer', '170+ Countries'],
    recommended: true,
  },
  {
    id: 'mesh',
    name: 'Mesh',
    description: 'Transfer from any exchange account',
    features: ['50+ Exchanges', 'Instant Transfer', 'Low Fees'],
  },
]

export const FundingMethodsPage: React.FC = () => {
  const navigate = useNavigate() as (opts: { to: string }) => void

  const providers = DEFAULT_PROVIDERS

  const handleProviderSelect = (_providerId: string) => {
    navigate({ to: checkoutNavigationRoutes.fundingProvider })
  }

  return (
    <PageContainer>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Select a funding method
      </Typography>

      {providers.map((provider) => (
        <MethodCard
          key={provider.id}
          onClick={() => handleProviderSelect(provider.id)}
        >
          <MethodContent>
            <ProviderLogo>
              {provider.name.substring(0, 2).toUpperCase()}
            </ProviderLogo>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {provider.name}
                </Typography>
                {provider.recommended && (
                  <Chip
                    size="small"
                    label="Recommended"
                    color="primary"
                    sx={{ height: 20, fontSize: 11 }}
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {provider.description}
              </Typography>
              <FeatureList>
                {provider.features.map((feature) => (
                  <Chip
                    key={feature}
                    size="small"
                    label={feature}
                    variant="outlined"
                    sx={{ height: 22, fontSize: 11 }}
                  />
                ))}
              </FeatureList>
            </Box>
          </MethodContent>
        </MethodCard>
      ))}
    </PageContainer>
  )
}
