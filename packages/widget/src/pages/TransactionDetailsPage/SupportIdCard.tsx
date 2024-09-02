import { ContentCopyRounded, OpenInNew } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card/Card.js';
import { CardIconButton } from '../../components/Card/CardIconButton.js';
import { CardTitle } from '../../components/Card/CardTitle.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';

interface SupportIdCardProps {
  supportId: string;
}

const getTxHash = (supportId: string) =>
  supportId.indexOf('_') !== -1
    ? supportId.substring(0, supportId.indexOf('_'))
    : supportId;

export const SupportIdCard = ({ supportId }: SupportIdCardProps) => {
  const { t } = useTranslation();

  const { explorerUrl } = useWidgetConfig();

  const copySupportId = async () => {
    await navigator.clipboard.writeText(supportId);
  };

  const openSupportIdInExplorer = () => {
    const txHash = getTxHash(supportId);
    window.open(`${explorerUrl}${txHash}`, '_blank');
  };

  return (
    <Card sx={{ marginTop: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
        }}
      >
        <CardTitle flex={1}>{t('main.supportId')}</CardTitle>
        <Box
          sx={{
            gap: 1,
            display: 'flex',
            marginRight: 2,
            marginTop: 1,
          }}
        >
          <CardIconButton size="small" onClick={copySupportId}>
            <ContentCopyRounded fontSize="inherit" />
          </CardIconButton>
          {explorerUrl ? (
            <CardIconButton size="small" onClick={openSupportIdInExplorer}>
              <OpenInNew fontSize="inherit" />
            </CardIconButton>
          ) : null}
        </Box>
      </Box>
      <Typography
        variant="body2"
        pt={1}
        pb={2}
        px={2}
        sx={{ wordBreak: 'break-all' }}
      >
        {supportId}
      </Typography>
    </Card>
  );
};
