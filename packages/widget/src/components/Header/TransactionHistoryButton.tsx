import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import { useNavigateBack } from '../../hooks';
import { navigationRoutes } from '../../utils';

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
        <ReceiptLongIcon />
      </IconButton>
    </Tooltip>
  );
};
