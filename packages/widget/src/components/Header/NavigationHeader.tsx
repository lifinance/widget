import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useNavigateBack } from '../../hooks';
import { useWallet, useWidgetConfig } from '../../providers';
import { useHeaderStore } from '../../stores';
import { HiddenUI } from '../../types';
import {
  backButtonRoutes,
  navigationRoutes,
  navigationRoutesValues,
} from '../../utils';
import { HeaderAppBar } from './Header.style';
import { NavigationTabs } from './NavigationTabs';
import { WalletMenuButton } from './WalletHeader';

export const NavigationHeader: React.FC = () => {
  const { t } = useTranslation();
  const { subvariant, hiddenUI, variant } = useWidgetConfig();
  const { navigate, navigateBack } = useNavigateBack();
  const { account } = useWallet();
  const { element, title } = useHeaderStore((state) => state);
  const { pathname } = useLocation();

  const cleanedPathname = pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
  const path = cleanedPathname.substring(cleanedPathname.lastIndexOf('/') + 1);
  const hasPath = navigationRoutesValues.includes(path);

  const splitSubvariant = subvariant === 'split' && !hasPath;

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
      case navigationRoutes.transactionHistory:
        return t(`header.transactionHistory`);
      case navigationRoutes.fromToken: {
        if (subvariant === 'nft') {
          return t(`header.payWith`);
        }
        return t(`header.from`);
      }
      case navigationRoutes.toToken:
        return t(`header.to`);
      case navigationRoutes.fromChain:
      case navigationRoutes.toChain:
      case navigationRoutes.toTokenNative:
        return t(`header.selectChain`);
      case navigationRoutes.routes:
        return t(`header.youGet`);
      case navigationRoutes.activeTransactions:
        return t(`header.activeTransactions`);
      case navigationRoutes.transactionExecution: {
        if (subvariant === 'nft') {
          return t(`header.purchase`);
        }
        return t(`header.exchange`);
      }
      case navigationRoutes.transactionDetails: {
        if (subvariant === 'nft') {
          return t(`header.purchaseDetails`);
        }
        return t(`header.transactionDetails`);
      }
      default: {
        switch (subvariant) {
          case 'nft':
            return t(`header.checkout`);
          case 'refuel':
            return t(`header.gas`);
          default:
            return t(`header.exchange`);
        }
      }
    }
  };

  return (
    <>
      <HeaderAppBar elevation={0}>
        {backButtonRoutes.includes(path) ? (
          <IconButton size="medium" edge="start" onClick={navigateBack}>
            <ArrowBackIcon />
          </IconButton>
        ) : null}
        {splitSubvariant ? (
          <Box flex={1}>
            {!hiddenUI?.includes(HiddenUI.WalletMenu) ? (
              <WalletMenuButton />
            ) : null}
          </Box>
        ) : (
          <Typography
            fontSize={hasPath ? 18 : 24}
            align={hasPath ? 'center' : 'left'}
            fontWeight="700"
            flex={1}
            noWrap
          >
            {title || handleHeaderTitle()}
          </Typography>
        )}
        <Routes>
          <Route
            path={navigationRoutes.home}
            element={
              <Box
                paddingRight={
                  variant === 'drawer' && subvariant === 'split' ? 5 : 0
                }
              >
                {account.isActive && !hiddenUI?.includes(HiddenUI.History) ? (
                  <Tooltip
                    title={t(`header.transactionHistory`)}
                    enterDelay={400}
                    arrow
                  >
                    <IconButton
                      size="medium"
                      edge="start"
                      onClick={() =>
                        navigate(navigationRoutes.transactionHistory)
                      }
                    >
                      <ReceiptLongIcon />
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
              </Box>
            }
          />
          <Route path="*" element={element || <Box width={28} height={40} />} />
        </Routes>
      </HeaderAppBar>
      {splitSubvariant ? <NavigationTabs /> : null}
    </>
  );
};
