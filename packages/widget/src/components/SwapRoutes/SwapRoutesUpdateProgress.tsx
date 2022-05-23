/* eslint-disable react/no-array-index-key */
import { BoxProps } from '@mui/material';
import { useSwapRoutes } from '../../hooks';
import { ProgressToNextUpdate } from '../ProgressToNextUpdate';

export const SwapRoutesUpdateProgress: React.FC<BoxProps> = (props) => {
  const { isLoading, isFetching, dataUpdatedAt, refetchTime } = useSwapRoutes();

  return (
    <ProgressToNextUpdate
      updatedAt={dataUpdatedAt}
      timeToUpdate={refetchTime}
      isLoading={isLoading || isFetching}
      {...props}
    />
  );
};
