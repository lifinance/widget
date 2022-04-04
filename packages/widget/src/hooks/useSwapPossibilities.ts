import LiFi, { PossibilityTopic } from '@lifinance/sdk';
import { useQuery } from 'react-query';

export const useSwapPossibilities = (topic: PossibilityTopic) => {
  return useQuery(['swap-possibilities', topic], () =>
    LiFi.getPossibilities({ include: [topic] }),
  );
};
