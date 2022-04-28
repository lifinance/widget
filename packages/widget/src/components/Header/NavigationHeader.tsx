import {
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../../utils/routes';
import { HeaderAppBar } from './Header.style';

const backButtonRoutes = [
  routes.selectWallet,
  routes.settings,
  routes.fromToken,
  routes.toToken,
  routes.swapRoutes,
  routes.swapping,
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
      case routes.selectWallet:
        return t(`header.selectWallet`);
      case routes.settings:
        return t(`header.settings`);
      case routes.fromToken:
        return t(`header.from`);
      case routes.toToken:
        return t(`header.to`);
      case routes.swapRoutes:
        return t(`header.routes`);
      case routes.swapping:
        return t(`header.swapping`);
      default:
        return t(`header.swap`);
    }
  };

  return (
    <HeaderAppBar elevation={0}>
      {/* <Collapse
        collapsedSize={0}
        orientation="horizontal"
        in={routesWithBack.includes(pathname)}
      > */}
      {backButtonRoutes.includes(pathname) ? (
        <IconButton
          size="medium"
          aria-label="settings"
          color="inherit"
          edge="start"
          onClick={handleBack}
        >
          <ArrowBackIcon />
        </IconButton>
      ) : null}
      {/* </Collapse> */}
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
          size="medium"
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
    </HeaderAppBar>
  );
};
