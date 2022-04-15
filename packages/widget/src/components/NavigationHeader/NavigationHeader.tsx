import {
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../../utils/routes';
import { Header } from '../Header';

const routesWithBack = [
  routes.settings,
  routes.fromToken,
  routes.toToken,
  routes.selectWallet,
  routes.transaction,
];

export const NavigationHeader: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSettings = () => {
    navigate(routes.settings);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleHeaderTitle = () => {
    switch (pathname) {
      case routes.settings:
        return t(`header.settings`);
      case routes.fromToken:
        return t(`swap.from`);
      case routes.toToken:
        return t(`swap.to`);
      case routes.selectWallet:
        return t(`header.selectWallet`);
      case routes.transaction:
        return t(`header.processIsOn`);
      default:
        return t(`header.swap`);
    }
  };

  return (
    <Header>
      <Collapse
        collapsedSize={0}
        orientation="horizontal"
        in={routesWithBack.includes(pathname)}
      >
        <IconButton
          size="large"
          aria-label="settings"
          color="inherit"
          edge="start"
          onClick={handleBack}
        >
          <ArrowBackIcon />
        </IconButton>
      </Collapse>
      <Typography
        color="black"
        fontSize={pathname === '/' ? 32 : 24}
        align={pathname === '/' ? 'left' : 'center'}
        fontWeight="bold"
        flex={1}
        noWrap
      >
        {handleHeaderTitle()}
      </Typography>
      {pathname === '/' ? (
        <IconButton
          size="large"
          aria-label="settings"
          color="inherit"
          edge="end"
          onClick={handleSettings}
        >
          <SettingsIcon />
        </IconButton>
      ) : (
        <Box width={36} height={48} />
      )}
    </Header>
  );
};
