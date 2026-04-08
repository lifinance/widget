import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import OpenInNew from '@mui/icons-material/OpenInNew'
import { Box, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { CardIconButton } from '../../components/Card/CardIconButton.js'
import { CardTitle } from '../../components/Card/CardTitle.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { HiddenUI } from '../../types/widget.js'
import { ContactSupportButton } from './ContactSupportButton.js'

interface TransferIdCardProps {
  transferId: string
  txLink?: string
}

export const TransferIdCard = ({
  transferId,
  txLink,
}: TransferIdCardProps): JSX.Element => {
  const { t } = useTranslation()
  const { hiddenUI } = useWidgetConfig()

  const copyTransferId = async () => {
    await navigator.clipboard.writeText(transferId)
  }

  const openTransferIdInExplorer = () => {
    window.open(txLink, '_blank')
  }

  return (
    <Card type="default" indented>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <CardTitle sx={{ p: 0 }}>{t('main.transferId')}</CardTitle>
        <Box
          sx={{
            gap: 1,
            display: 'flex',
          }}
        >
          <CardIconButton size="small" onClick={copyTransferId}>
            <ContentCopyRounded fontSize="inherit" />
          </CardIconButton>
          {txLink ? (
            <CardIconButton size="small" onClick={openTransferIdInExplorer}>
              <OpenInNew fontSize="inherit" />
            </CardIconButton>
          ) : null}
          {!hiddenUI?.includes(HiddenUI.ContactSupport) ? (
            <ContactSupportButton supportId={transferId} />
          ) : null}
        </Box>
      </Box>
      <Typography
        variant="body2"
        sx={{
          pt: 2,
          wordBreak: 'break-all',
        }}
      >
        {transferId}
      </Typography>
    </Card>
  )
}
