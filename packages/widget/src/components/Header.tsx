import { Tune as TuneIcon } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
}));

const HeaderToolbar = styled(Toolbar)({
  '@media all': {
    minHeight: 48,
  },
});

export const Header: React.FC = ({ children }) => (
  <HeaderAppBar position="relative" elevation={0}>
    <HeaderToolbar>{children}</HeaderToolbar>
  </HeaderAppBar>
);

export const WalletHeader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Header>
      <Typography
        variant="body2"
        noWrap
        align="right"
        sx={{ flexGrow: 1 }}
        color="grey.500"
      >
        {t(`swap.header.walletConnected`, { walletAddress: '0000000000' })}
      </Typography>
    </Header>
  );
};

export const MainHeader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Header>
      <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
        {t(`swap.header.title`)}
      </Typography>
      <IconButton size="large" aria-label="settings" color="inherit" edge="end">
        <TuneIcon />
      </IconButton>
    </Header>
  );
};
