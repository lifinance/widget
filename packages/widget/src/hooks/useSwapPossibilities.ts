import Lifi from '@lifinance/sdk';
import { useQuery } from 'react-query';

export const useSwapPossibilities = () => {
  return useQuery('swap-possibilities', () => Lifi.getPossibilities());
};
