import type { RouteExtended } from '@lifi/sdk'
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import OpenInNew from '@mui/icons-material/OpenInNew'
import { IconButton, Typography } from '@mui/material'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionRow } from '../../components/ActionRow/ActionRow.js'
import { Card } from '../../components/Card/Card.js'
import { StepActionRow } from '../../components/Step/StepActionRow.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { prepareActions } from '../../utils/prepareActions.js'
import { shortenAddress } from '../../utils/wallet.js'
import { ExternalLink, TransactionList } from './Receipts.style.js'

interface ReceiptsProps {
  route: RouteExtended
}

export const Receipts: React.FC<ReceiptsProps> = ({ route }) => {
  const { t } = useTranslation()
  const { getAddressLink } = useExplorer()
  const toAddress = route.toAddress

  const handleCopy = (e: MouseEvent) => {
    e.stopPropagation()
    if (toAddress) {
      navigator.clipboard.writeText(toAddress)
    }
  }

  const addressLink = toAddress
    ? getAddressLink(toAddress, route.toChainId)
    : undefined

  return (
    <Card type="default" sx={{ padding: 3 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 3 }}>
        {t('main.receipts')}
      </Typography>
      <TransactionList>
        {route.steps.map((step) => (
          <TransactionList key={step.id}>
            {prepareActions(step.execution?.actions ?? []).map(
              (actionsGroup, index) => (
                <StepActionRow
                  key={index}
                  step={step}
                  actionsGroup={actionsGroup}
                />
              )
            )}
          </TransactionList>
        ))}
        {toAddress ? (
          <ActionRow
            variant="wallet"
            message={t('main.sentToWallet', {
              address: shortenAddress(toAddress),
            })}
            endAdornment={
              <>
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
              </>
            }
          />
        ) : undefined}
      </TransactionList>
    </Card>
  )
}
