import { ArrowForward, ErrorRounded, InfoRounded } from '@mui/icons-material';
import { ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useProcessMessage } from '../../hooks/useProcessMessage.js';
import { useRouteExecution } from '../../hooks/useRouteExecution.js';
import { RouteExecutionStatus } from '../../stores/routes/types.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { TokenAvatarGroup } from '../Avatar/Avatar.style.js';
import { TokenAvatar } from '../Avatar/TokenAvatar.js';
import { StepTimer } from '../Step/StepTimer.js';
import { ListItem, ListItemButton } from './ActiveTransactions.style.js';

export const ActiveTransactionItem: React.FC<{
  routeId: string;
  dense?: boolean;
}> = ({ routeId, dense }) => {
  const navigate = useNavigate();
  const { route, status } = useRouteExecution({
    routeId,
    executeInBackground: true,
  });

  const lastActiveStep = route?.steps.findLast((step) => step.execution);
  const lastActiveProcess = lastActiveStep?.execution?.process.at(-1);

  const { title } = useProcessMessage(lastActiveStep, lastActiveProcess);

  if (!route || !lastActiveStep) {
    return null;
  }

  const handleClick = () => {
    navigate(navigationRoutes.transactionExecution, { state: { routeId } });
  };

  const getStatusComponent = () => {
    switch (lastActiveProcess?.status) {
      case 'ACTION_REQUIRED':
        return <InfoRounded color="info" fontSize="small" />;
      case 'FAILED':
        return <ErrorRounded color="error" fontSize="small" />;
      default:
        return (
          <Typography fontSize={14} fontWeight={500}>
            <StepTimer step={lastActiveStep} hideInProgress />
          </Typography>
        );
    }
  };

  const ListItemComponent = dense ? ListItem : ListItemButton;

  return (
    <ListItemComponent onClick={handleClick} dense disableRipple={dense}>
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
          <Typography
            fontWeight={500}
            lineHeight={1}
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 2,
              height: 16,
            }}
          >
            {route.fromToken.symbol}
            <ArrowForward sx={{ paddingX: 0.5 }} />
            {route.toToken.symbol}
          </Typography>
        }
        secondary={
          status !== RouteExecutionStatus.Done ? (
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
    </ListItemComponent>
  );
};
