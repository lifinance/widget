import { Tooltip } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { navigationRoutes } from '../../utils';
import { useTranslation } from 'react-i18next';
import { useNavigateBack } from '../../hooks';
import { HistoryIconButton } from './TransactionHistoryButton.style';

export const TransactionHistoryButton = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigateBack();

  return (
    <Tooltip title={t(`header.transactionHistory`)} enterDelay={400} arrow>
      <HistoryIconButton
        size="medium"
        edge="start"
        onClick={() => navigate(navigationRoutes.transactionHistory)}
      >
        <ReceiptLongIcon />
      </HistoryIconButton>
    </Tooltip>
  );
};
