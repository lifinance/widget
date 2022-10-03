import {
  ArrowBack as ArrowBackIcon,
  History as HistoryIcon,
  SettingsOutlined as SettingsIcon,
} from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useNavigateBack } from '../../hooks';
import { useWallet } from '../../providers';
import {
  backButtonRoutes,
  navigationRoutes,
  navigationRoutesValues,
} from '../../utils';
import { HeaderAppBar } from './Header.style';
import { useHeaderActionStore } from './useHeaderActionStore';

export const NavigationHeader: React.FC = () => {
  const { t } = useTranslation();
  const { navigate, navigateBack } = useNavigateBack();
  const { account } = useWallet();
  const { element } = useHeaderActionStore();
  const { pathname } = useLocation();

  const cleanedPathname = pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
  const path = cleanedPathname.substring(cleanedPathname.lastIndexOf('/') + 1);
  const hasPath = navigationRoutesValues.includes(path);

  const handleHeaderTitle = () => {
    switch (path) {
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
      case navigationRoutes.fromChain:
      case navigationRoutes.toChain:
        return t(`header.selectChain`);
      case navigationRoutes.swapRoutes:
        return t(`header.routes`);
      case navigationRoutes.activeSwaps:
        return t(`header.activeSwaps`);
      case navigationRoutes.swapExecution:
        return t(`header.swap`);
      case navigationRoutes.swapDetails:
        return t(`header.swapDetails`);
      default:
        return t(`header.swap`);
    }
  };

  return (
    <HeaderAppBar elevation={0}>
      {backButtonRoutes.includes(path) ? (
        <IconButton size="medium" edge="start" onClick={navigateBack}>
          <ArrowBackIcon />
        </IconButton>
      ) : null}
      <Typography
        fontSize={hasPath ? 18 : 24}
        align={hasPath ? 'center' : 'left'}
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
                  edge="start"
                  onClick={() => navigate(navigationRoutes.swapHistory)}
                >
                  <HistoryIcon />
                </IconButton>
              ) : null}
              <IconButton
                size="medium"
                edge="end"
                onClick={() => navigate(navigationRoutes.settings)}
              >
                <SettingsIcon />
              </IconButton>
            </>
          }
        />
        <Route path="*" element={element || <Box width={28} height={40} />} />
      </Routes>
    </HeaderAppBar>
  );
};
