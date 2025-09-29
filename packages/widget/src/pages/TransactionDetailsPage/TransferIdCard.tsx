import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import OpenInNew from '@mui/icons-material/OpenInNew'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { CardIconButton } from '../../components/Card/CardIconButton.js'
import { CardTitle } from '../../components/Card/CardTitle.js'

interface TransferIdCardProps {
  transferId: string
  txLink?: string
}

export const TransferIdCard = ({ transferId, txLink }: TransferIdCardProps) => {
  const { t } = useTranslation()

  const copyTransferId = async () => {
    await navigator.clipboard.writeText(transferId)
  }

  const openTransferIdInExplorer = () => {
    window.open(txLink, '_blank')
  }

  return (
    <Card sx={{ marginTop: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
        }}
      >
        <CardTitle flex={1}>{t('main.transferId')}</CardTitle>
        <Box
          sx={{
            gap: 1,
            display: 'flex',
            marginRight: 2,
            marginTop: 1,
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
        </Box>
      </Box>
      <Typography
        variant="body2"
        sx={{
          pt: 1,
          pb: 2,
          px: 2,
          wordBreak: 'break-all',
        }}
      >
        {transferId}
      </Typography>
    </Card>
  )
}
