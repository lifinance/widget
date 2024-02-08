import { ReceiptLong } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';

export const TransactionHistoryButton = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigateBack();

  return (
    <Tooltip title={t(`header.transactionHistory`)} enterDelay={400} arrow>
      <IconButton
        size="medium"
        edge="start"
        onClick={() => navigate(navigationRoutes.transactionHistory)}
      >
        <ReceiptLong />
      </IconButton>
    </Tooltip>
  );
};
