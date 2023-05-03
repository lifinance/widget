import { useSplitSubvariantStore } from '../stores';

export const useSwapOnly = () => {
  const state = useSplitSubvariantStore((state) => state.state);
  return state === 'swap';
};
