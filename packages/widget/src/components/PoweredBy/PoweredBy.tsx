import { Box, Tooltip, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { version } from '../../config/version';
import { useWidgetConfig } from '../../providers';
import { HiddenUI } from '../../types';
import { navigationRoutes } from '../../utils';
import { LiFiLogo } from '../LiFiLogo';
import { Link } from './PoweredBy.style';

export const PoweredBy: React.FC = () => {
  const { hiddenUI } = useWidgetConfig();
  const { pathname } = useLocation();
  if (
    pathname.includes(navigationRoutes.fromToken) ||
    pathname.includes(navigationRoutes.toToken)
  ) {
    return null;
  }
  return (
    <Box
      px={3}
      py={hiddenUI?.includes(HiddenUI.PoweredBy) ? 1 : 2}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      }}
    >
      {!hiddenUI?.includes(HiddenUI.PoweredBy) ? (
        <Tooltip title={`v${version}`} placement="top" enterDelay={3000} arrow>
          <Link
            href="https://li.fi"
            target="_blank"
            underline="none"
            color="text.primary"
          >
            <Typography color="text.secondary" fontSize={12} px={0.5}>
              Powered by
            </Typography>
            <LiFiLogo variant="full" style={{ height: 16, width: 42 }} />
          </Link>
        </Tooltip>
      ) : null}
    </Box>
  );
};
