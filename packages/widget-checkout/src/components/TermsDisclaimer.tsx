import { Link, Typography } from '@mui/material'
import type { JSX } from 'react'
import { Trans } from 'react-i18next'
import { useOnRampProviderByCategory } from '../providers/OnRampProvider/OnRampProvider.js'
import { useCheckoutFlowStore } from '../stores/useCheckoutFlowStore.js'

const LIFI_TERMS_URL = 'https://li.fi/legal/terms-and-conditions/'

export const TermsDisclaimer: React.FC = (): JSX.Element | null => {
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const exchangeProvider = useOnRampProviderByCategory('exchange')
  if (fundingSource !== 'exchange' || exchangeProvider?.id !== 'mesh') {
    return null
  }
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        display: 'block',
        pt: 1,
        px: 2,
        textAlign: 'center',
        fontSize: 12,
        lineHeight: '16px',
      }}
    >
      <Trans
        i18nKey="checkout.legal.termsDisclaimer"
        components={{
          terms: (
            <Link
              href={LIFI_TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              underline="always"
              color="text.primary"
            />
          ),
        }}
      />
    </Typography>
  )
}
