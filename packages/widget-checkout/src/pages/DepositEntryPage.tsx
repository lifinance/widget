import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import { Box, Card, CardContent, styled, Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { checkoutNavigationRoutes } from '../utils/navigationRoutes.js'

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  flex: 1,
}))

const OptionCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}))

const OptionContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5),
  '&:last-child': {
    paddingBottom: theme.spacing(2.5),
  },
}))

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: 12,
  backgroundColor:
    theme.vars?.palette?.primary?.main ?? theme.palette.primary.main,
  color:
    theme.vars?.palette?.primary?.contrastText ??
    theme.palette.primary.contrastText,
}))

export const DepositEntryPage: React.FC = () => {
  const navigate = useNavigate() as (opts: { to: string }) => void

  const handleFundingMethodSelect = () => {
    navigate({ to: checkoutNavigationRoutes.fundingMethods })
  }

  return (
    <PageContainer>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
        Choose how you'd like to add funds to your wallet
      </Typography>

      <OptionCard onClick={handleFundingMethodSelect}>
        <OptionContent>
          <IconContainer>
            <CreditCardIcon />
          </IconContainer>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Buy with Card
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Purchase crypto using a credit or debit card
            </Typography>
          </Box>
        </OptionContent>
      </OptionCard>

      <OptionCard onClick={handleFundingMethodSelect}>
        <OptionContent>
          <IconContainer>
            <AccountBalanceWalletIcon />
          </IconContainer>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Transfer from Exchange
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Move funds from a centralized exchange
            </Typography>
          </Box>
        </OptionContent>
      </OptionCard>
    </PageContainer>
  )
}
