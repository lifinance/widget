import { Container, List } from '@mui/material';
import { ActiveSwapItem } from '../../components/ActiveSwaps';
import { useWallet } from '../../providers';
import { useExecutingRoutesIds } from '../../stores';
import { ActiveSwapsEmpty } from './ActiveSwapsEmpty';

export const ActiveSwapsPage = () => {
  const { account } = useWallet();
  const executingRoutes = useExecutingRoutesIds(account.address);
  if (!executingRoutes.length) {
    return <ActiveSwapsEmpty />;
  }

  return (
    <Container disableGutters>
      <List
        sx={{
          paddingLeft: 1.5,
          paddingRight: 1.5,
        }}
      >
        {executingRoutes.map((routeId) => (
          <ActiveSwapItem key={routeId} routeId={routeId} />
        ))}
      </List>
    </Container>
  );
};
