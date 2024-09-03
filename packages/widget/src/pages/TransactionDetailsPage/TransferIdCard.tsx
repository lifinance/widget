import { ContentCopyRounded, OpenInNew } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card/Card.js';
import { CardIconButton } from '../../components/Card/CardIconButton.js';
import { CardTitle } from '../../components/Card/CardTitle.js';
import { lifiExplorerUrl } from '../../config/constants.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';

interface TransferIdCardProps {
  transferId: string;
}

const getTxHash = (transferId: string) =>
  transferId.indexOf('_') !== -1
    ? transferId.substring(0, transferId.indexOf('_'))
    : transferId;

export const TransferIdCard = ({ transferId }: TransferIdCardProps) => {
  const { t } = useTranslation();

  const { explorerUrl } = useWidgetConfig();

  const copyTransferId = async () => {
    await navigator.clipboard.writeText(transferId);
  };

  const openTransferIdInExplorer = () => {
    const txHash = getTxHash(transferId);
    const urlBase = explorerUrl ?? lifiExplorerUrl;
    window.open(`${urlBase}/tx/${txHash}`, '_blank');
  };

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
        pt={1}
        pb={2}
        px={2}
        sx={{ wordBreak: 'break-all' }}
      >
        {transferId}
      </Typography>
    </Card>
  );
};
