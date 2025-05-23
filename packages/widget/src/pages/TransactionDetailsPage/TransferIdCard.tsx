import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import OpenInNew from '@mui/icons-material/OpenInNew'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { CardIconButton } from '../../components/Card/CardIconButton.js'
import { CardTitle } from '../../components/Card/CardTitle.js'
import { useExplorer } from '../../hooks/useExplorer.js'

interface TransferIdCardProps {
  transferId: string
}

const getTxHash = (transferId: string) =>
  transferId.indexOf('_') !== -1
    ? transferId.substring(0, transferId.indexOf('_'))
    : transferId

export const TransferIdCard = ({ transferId }: TransferIdCardProps) => {
  const { t } = useTranslation()
  const { getTransactionLink } = useExplorer()

  const copyTransferId = async () => {
    await navigator.clipboard.writeText(transferId)
  }

  const openTransferIdInExplorer = () => {
    const txHash = getTxHash(transferId)
    window.open(getTransactionLink({ txHash }), '_blank')
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
          <CardIconButton size="small" onClick={openTransferIdInExplorer}>
            <OpenInNew fontSize="inherit" />
          </CardIconButton>
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
