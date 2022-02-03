import {
  ArrowBack as ArrowBackIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import { Collapse, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../utils/routes';
import { Header } from './Header';

const routesWithBack = [routes.settings, routes.selectToken];

export const NavigationHeader: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSettings = () => {
    navigate(routes.settings, { replace: true });
  };

  const handleBack = () => {
    navigate(routes.home, { replace: true });
  };

  const handleHeaderTitle = () => {
    switch (location.pathname) {
      case routes.settings:
        return t(`swap.header.settings`);
      case routes.selectToken:
        return t(`swap.header.iWouldLikeToSwap`);
      default:
        return t(`swap.header.swap`);
    }
  };

  return (
    <Header>
      <Collapse
        collapsedSize={0}
        orientation="horizontal"
        in={routesWithBack.includes(location.pathname)}
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
      <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
        {handleHeaderTitle()}
      </Typography>
      {location.pathname === '/' && (
        <IconButton
          size="large"
          aria-label="settings"
          color="inherit"
          edge="end"
          onClick={handleSettings}
        >
          <TuneIcon />
        </IconButton>
      )}
    </Header>
  );
};
