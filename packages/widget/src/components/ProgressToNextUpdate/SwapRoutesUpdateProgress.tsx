/* eslint-disable react/no-array-index-key */
import { IconButtonProps } from '@mui/material';
import { ProgressToNextUpdate } from '.';
import { useSwapRoutes } from '../../hooks';

export const SwapRoutesUpdateProgress: React.FC<IconButtonProps> = ({
  sx,
  ...other
}) => {
  const { isFetching, dataUpdatedAt, refetchTime, refetch } = useSwapRoutes();

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
