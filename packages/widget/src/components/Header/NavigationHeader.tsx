import {
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { navigationRoutes, navigationRoutesValues } from '../../utils';
import { SwapRoutesUpdateProgress } from '../SwapRoutes/SwapRoutesUpdateProgress';
import { HeaderAppBar } from './Header.style';

const backButtonRoutes = [
  navigationRoutes.selectWallet,
  navigationRoutes.settings,
  navigationRoutes.fromToken,
  navigationRoutes.toToken,
  navigationRoutes.swapRoutes,
  navigationRoutes.swap,
];

export const NavigationHeader: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const path = pathname.substring(pathname.lastIndexOf('/') + 1);
  const hasPath = navigationRoutesValues.includes(path);
  const navigate = useNavigate();

  const handleSettings = () => {
    navigate(navigationRoutes.settings);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleHeaderTitle = () => {
    switch (path) {
      case navigationRoutes.selectWallet:
        return t(`header.selectWallet`);
      case navigationRoutes.settings:
        return t(`header.settings`);
      case navigationRoutes.fromToken:
        return t(`header.from`);
      case navigationRoutes.toToken:
        return t(`header.to`);
      case navigationRoutes.swapRoutes:
        return t(`header.routes`);
      case navigationRoutes.swap:
        return t(`header.swap`);
      default:
        return t(`header.swap`);
    }
  };

  return (
    <HeaderAppBar elevation={0}>
      {backButtonRoutes.includes(path) ? (
        <IconButton
          size="medium"
          aria-label="settings"
          edge="start"
          onClick={handleBack}
        >
          <ArrowBackIcon />
        </IconButton>
      ) : null}
      <Typography
        fontSize={hasPath ? 24 : 32}
        align={hasPath ? 'center' : 'left'}
        fontWeight="700"
        flex={1}
        noWrap
      >
        {handleHeaderTitle()}
      </Typography>
      <Routes>
        <Route
          path={navigationRoutes.swapRoutes}
          element={
            <SwapRoutesUpdateProgress
              size="medium"
              edge="end"
              sx={{ marginRight: -1 }}
            />
          }
        />
        <Route
          path={navigationRoutes.home}
          element={
            <IconButton
              size="medium"
              aria-label="settings"
              edge="end"
              onClick={handleSettings}
            >
              <SettingsIcon />
            </IconButton>
          }
        />
        <Route path="*" element={<Box width={28} height={48} />} />
      </Routes>
    </HeaderAppBar>
  );
};
