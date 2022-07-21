/* eslint-disable react/no-array-index-key */
import { IconButtonProps } from '@mui/material';
import { useSwapRoutes } from '../../hooks';
import { ProgressToNextUpdate } from '../ProgressToNextUpdate';

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
