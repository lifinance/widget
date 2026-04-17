import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import OpenInNew from '@mui/icons-material/OpenInNew'
import Wallet from '@mui/icons-material/Wallet'
import { Box, IconButton } from '@mui/material'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useExplorer } from '../../hooks/useExplorer.js'
import { shortenAddress } from '../../utils/wallet.js'
import { ActionRow } from './ActionRow.js'
import { ActionIconCircle } from './ActionRow.style.js'
import { ExternalLink } from './ReceiptsCard.style.js'

interface SentToWalletRowProps {
  toAddress: string
  toChainId: number
}

export const SentToWalletRow: React.FC<SentToWalletRowProps> = ({
  toAddress,
  toChainId,
}) => {
  const { t } = useTranslation()
  const { getAddressLink } = useExplorer()
  const addressLink = getAddressLink(toAddress, toChainId)

  const handleCopy = (e: MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(toAddress)
  }

  return (
    <ActionRow
      startAdornment={
        <ActionIconCircle>
          <Wallet color="success" sx={{ fontSize: 16 }} />
        </ActionIconCircle>
      }
      message={`${t('main.sentToWallet')}: ${shortenAddress(toAddress)}`}
      endAdornment={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={handleCopy} sx={{ p: 0.5 }}>
            <ContentCopyRounded sx={{ fontSize: 16 }} />
          </IconButton>
          {addressLink ? (
            <ExternalLink
              href={addressLink}
              target="_blank"
              rel="nofollow noreferrer"
            >
              <OpenInNew sx={{ fontSize: 16 }} />
            </ExternalLink>
          ) : undefined}
        </Box>
      }
    />
  )
}
