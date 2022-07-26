import { Container, Stack } from '@mui/material';
import { useWallet } from '../../providers/WalletProvider';
import { useSwapHistory } from '../../stores/route';
import { SwapHistoryEmpty } from './SwapHistoryEmpty';
import { SwapHistoryItem } from './SwapHistoryItem';

export const SwapHistoryPage: React.FC = () => {
  const { account } = useWallet();
  const swaps = useSwapHistory(account.address);

  if (!swaps.length) {
    return <SwapHistoryEmpty />;
  }

  return (
    <Container>
      <Stack spacing={2} mt={1}>
        {swaps.length ? (
          swaps.map(({ route }) => (
            <SwapHistoryItem key={route.id} route={route} />
          ))
        ) : (
          <SwapHistoryEmpty />
        )}
      </Stack>
    </Container>
  );
};
