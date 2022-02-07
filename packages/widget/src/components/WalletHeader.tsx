import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';

export const WalletHeader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Header height={40}>
      <Typography
        variant="body2"
        noWrap
        align="right"
        sx={{ flexGrow: 1 }}
        color="grey.500"
        mt={2}
      >
        {t(`swap.header.walletConnected`, { walletAddress: '0000000000' })}
      </Typography>
    </Header>
  );
};
