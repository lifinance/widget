import {
  ArrowForward as ArrowForwardIcon,
  Info as InfoIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { Box, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useProcessMessage, useRouteExecution } from '../../hooks';
import { navigationRoutes } from '../../utils';
import { StepTimer } from '../Step/StepTimer';
import { TokenAvatar, TokenAvatarGroup } from '../TokenAvatar';
import { ListItem, ListItemButton } from './ActiveSwaps.style';

export const ActiveSwapItem: React.FC<{
  routeId: string;
  dense?: boolean;
}> = ({ routeId, dense }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { route, status } = useRouteExecution(routeId);

  // TODO: replace with ES2023 findLast
  const lastActiveStep = route?.steps
    .slice()
    .reverse()
    .find((step) => step.execution);
  const lastActiveProcess = lastActiveStep?.execution?.process.at(-1);

  const { title } = useProcessMessage(lastActiveStep, lastActiveProcess);

  if (!route || !lastActiveStep) {
    return null;
  }

  const handleClick = () => {
    navigate(navigationRoutes.swapExecution, { state: { routeId } });
  };

  const getStatusComponent = () => {
    switch (lastActiveProcess?.status) {
      case 'ACTION_REQUIRED':
        return <InfoIcon color="info" fontSize="small" />;
      case 'FAILED':
        return <WarningIcon color="error" fontSize="small" />;
      default:
        return (
          <Typography fontSize={14} fontWeight={500}>
            <StepTimer step={lastActiveStep} hideInProgress />
          </Typography>
        );
    }
  };

  const ListItemWrapper = dense ? ListItem : ListItemButton;

  return (
    <ListItemWrapper
      onClick={handleClick}
      dense
      disableRipple
    >
      <ListItemAvatar>
        <TokenAvatarGroup total={2}>
          <TokenAvatar token={route.fromToken} />
          <TokenAvatar token={route.toToken} />
        </TokenAvatarGroup>
      </ListItemAvatar>
      <ListItemText
        sx={{ margin: 0 }}
        disableTypography
        primary={
          <Typography fontWeight={500} lineHeight={1}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: 2,
                height: 16,
              }}
            >
              {route.fromToken.symbol}
              <ArrowForwardIcon sx={{ paddingX: 0.5 }} />
              {route.toToken.symbol}
            </Box>
          </Typography>
        }
        secondary={
          status !== 'success' ? (
            <Typography
              fontWeight={400}
              fontSize={12}
              color="text.secondary"
              lineHeight={1}
              mt={0.75}
              ml={2}
            >
              {title}
            </Typography>
          ) : null
        }
      />
      {getStatusComponent()}
    </ListItemWrapper>
  );
};
