/* eslint-disable react/no-array-index-key */
import { Box, IconButtonProps } from '@mui/material';
import { useSwapRoutes } from '../../hooks';
import { ProgressToNextUpdate } from '../ProgressToNextUpdate';

export const SwapRoutesUpdateProgress: React.FC<IconButtonProps> = ({
  sx,
  ...other
}) => {
  const { isLoading, isFetching, dataUpdatedAt, refetchTime, refetch } =
    useSwapRoutes();

  if (isLoading) {
    return <Box width={24} height={24} sx={sx} />;
  }

  return (
    <ProgressToNextUpdate
      updatedAt={dataUpdatedAt}
      timeToUpdate={refetchTime}
      isLoading={isFetching}
      onClick={() => refetch()}
      sx={sx}
      {...other}
    />
  );
};
