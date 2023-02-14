import {
  ArrowBack as ArrowBackIcon,
  ReceiptLongRounded as HistoryIcon,
  SettingsOutlined as SettingsIcon,
} from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useNavigateBack } from '../../hooks';
import { useWallet, useWidgetConfig } from '../../providers';
import {
  backButtonRoutes,
  navigationRoutes,
  navigationRoutesValues,
} from '../../utils';
import { HeaderAppBar } from './Header.style';
import { useHeaderActionStore } from './useHeaderActionStore';

export const NavigationHeader: React.FC = () => {
  const { t } = useTranslation();
  const { variant } = useWidgetConfig();
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
      case navigationRoutes.bridges:
        return t(`settings.enabledBridges`);
      case navigationRoutes.exchanges:
        return t(`settings.enabledExchanges`);
      case navigationRoutes.swapHistory:
        return t(`header.swapHistory`);
      case navigationRoutes.fromToken:
        return t(`header.from`);
      case navigationRoutes.toToken:
        return t(`header.to`);
      case navigationRoutes.fromChain:
      case navigationRoutes.toChain:
      case navigationRoutes.toTokenNative:
        return t(`header.selectChain`);
      case navigationRoutes.swapRoutes:
        return t(`header.routes`);
      case navigationRoutes.activeSwaps:
        return t(`header.activeSwaps`);
      case navigationRoutes.swapExecution:
        return t(`header.swap`);
      case navigationRoutes.swapDetails:
        return t(`header.swapDetails`);
      default: {
        switch (variant) {
          case 'nft':
            return t(`header.checkout`);
          case 'refuel':
            return t(`header.gas`);
          default:
            return t(`header.swap`);
        }
      }
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
                <Tooltip title={t(`header.swapHistory`)} enterDelay={400} arrow>
                  <IconButton
                    size="medium"
                    edge="start"
                    onClick={() => navigate(navigationRoutes.swapHistory)}
                  >
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
              <Tooltip title={t(`header.settings`)} enterDelay={400} arrow>
                <IconButton
                  size="medium"
                  onClick={() => navigate(navigationRoutes.settings)}
                  sx={{
                    marginRight: -1.25,
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </>
          }
        />
        <Route path="*" element={element || <Box width={28} height={40} />} />
      </Routes>
    </HeaderAppBar>
  );
};
