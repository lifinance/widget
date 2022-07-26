import {
  ArrowBack as ArrowBackIcon,
  History as HistoryIcon,
  SettingsOutlined as SettingsIcon,
} from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '../../providers/WalletProvider';
import { navigationRoutes } from '../../utils';
import { HeaderAppBar } from './Header.style';
import { useHeaderActionStore } from './useHeaderActionStore';

const backButtonRoutes = [
  navigationRoutes.selectWallet,
  navigationRoutes.settings,
  navigationRoutes.swapHistory,
  navigationRoutes.fromToken,
  navigationRoutes.toToken,
  navigationRoutes.swapRoutes,
  navigationRoutes.swap,
  navigationRoutes.swapDetails,
];

export const NavigationHeader: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { account } = useWallet();
  const { path: actionPath, element } = useHeaderActionStore();

  const handleBack = () => {
    navigate(-1);
  };

  const handleHeaderTitle = () => {
    switch (pathname) {
      case navigationRoutes.selectWallet:
        return t(`header.selectWallet`);
      case navigationRoutes.settings:
        return t(`header.settings`);
      case navigationRoutes.swapHistory:
        return t(`header.swapHistory`);
      case navigationRoutes.fromToken:
        return t(`header.from`);
      case navigationRoutes.toToken:
        return t(`header.to`);
      case navigationRoutes.swapRoutes:
        return t(`header.routes`);
      case navigationRoutes.swap:
        return t(`header.swap`);
      case navigationRoutes.swapDetails:
        return t(`header.swapDetails`);
      default:
        return t(`header.swap`);
    }
  };

  return (
    <HeaderAppBar elevation={0}>
      {backButtonRoutes.includes(pathname) ? (
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
        fontSize={pathname === '/' ? 24 : 18}
        align={pathname === '/' ? 'left' : 'center'}
        fontWeight="700"
        flex={1}
        noWrap
      >
        {handleHeaderTitle()}
      </Typography>
      <Routes>
        <Route
          path={navigationRoutes.home}
          element={
            <>
              {account.isActive ? (
                <IconButton
                  size="medium"
                  aria-label="swap-history"
                  edge="start"
                  onClick={() => navigate(navigationRoutes.swapHistory)}
                >
                  <HistoryIcon />
                </IconButton>
              ) : null}
              <IconButton
                size="medium"
                aria-label="settings"
                edge="end"
                onClick={() => navigate(navigationRoutes.settings)}
              >
                <SettingsIcon />
              </IconButton>
            </>
          }
        />
        <Route
          path={actionPath ?? '*'}
          element={element || <Box width={28} height={40} />}
        />
      </Routes>
    </HeaderAppBar>
  );
};
