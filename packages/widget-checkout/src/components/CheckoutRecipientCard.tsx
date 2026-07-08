import {
  ChainAvatar,
  shortenAddress,
  useChain,
  useToken,
  useWidgetConfig,
} from '@lifi/widget/shared'
import CloseIcon from '@mui/icons-material/Close'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import { Box, Card, Chip, IconButton, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutNavigate } from '../hooks/useCheckoutNavigate.js'
import { useResolvedCheckoutRecipient } from '../hooks/useResolvedCheckoutRecipient.js'
import { checkoutNavigationRoutes } from '../utils/navigationRoutes.js'

export const CheckoutRecipientCard: React.FC = (): JSX.Element | null => {
  const { t } = useTranslation()
  const navigate = useCheckoutNavigate()
  const { recipient, isUserSettable, clearUserRecipient } =
    useResolvedCheckoutRecipient()
  const { toChain, toToken } = useWidgetConfig()
  const { token } = useToken(toChain, toToken)
  const { chain: destinationChain } = useChain(toChain)

  if (!isUserSettable) {
    return null
  }

  if (!recipient) {
    return (
      <Card
        variant="outlined"
        onClick={() =>
          navigate({ to: checkoutNavigationRoutes.setDestination })
        }
        sx={{ p: 2, cursor: 'pointer' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {t('checkout.whereToSendIt')}
          </Typography>
          <Chip
            size="small"
            variant="filled"
            icon={<ErrorRounded />}
            label={t('checkout.required')}
            sx={(theme) => ({
              bgcolor: theme.vars.palette.warning.light,
              color: theme.vars.palette.warning.dark,
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: theme.vars.palette.warning.dark,
                fontSize: 16,
              },
            })}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t('checkout.addWalletToReceive', { token: token?.symbol ?? '' })}
        </Typography>
      </Card>
    )
  }

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
        {t('checkout.sendingTo')}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ChainAvatar
          src={destinationChain?.logoURI}
          alt={destinationChain?.name}
        >
          {destinationChain?.name?.[0] ?? '?'}
        </ChainAvatar>
        <Typography variant="body1" sx={{ flex: 1, fontWeight: 500 }}>
          {shortenAddress(recipient.address)}
        </Typography>
        <IconButton
          size="small"
          aria-label={t('button.close')}
          onClick={clearUserRecipient}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  )
}
