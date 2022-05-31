/* eslint-disable react/no-array-index-key */
import { Box, BoxProps } from '@mui/material';
import { useSwapRoutes } from '../../hooks';
import { ProgressToNextUpdate } from '../ProgressToNextUpdate';

export const SwapRoutesUpdateProgress: React.FC<BoxProps> = (props) => {
  const { isLoading, isFetching, dataUpdatedAt, refetchTime } = useSwapRoutes();

  if (isLoading) {
    return <Box width={24} height={24} {...props} />;
  }

  return (
    <ProgressToNextUpdate
      updatedAt={dataUpdatedAt}
      timeToUpdate={refetchTime}
      isLoading={isFetching}
      {...props}
    />
  );
};
