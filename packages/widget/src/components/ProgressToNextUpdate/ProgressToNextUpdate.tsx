import { Box, BoxProps, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

const calculateTime = (updatedAt: number, timeToUpdate: number) => {
  if (updatedAt === 0) {
    return 0;
  }
  const progress = ((Date.now() - updatedAt) / timeToUpdate) * 100;
  return progress >= 100 ? 100 : progress;
};

export const ProgressToNextUpdate: React.FC<
  {
    updatedAt: number;
    timeToUpdate: number;
    isLoading?: boolean;
  } & BoxProps
> = ({ updatedAt, timeToUpdate, isLoading, ...other }) => {
  const [value, setValue] = useState(() =>
    calculateTime(updatedAt, timeToUpdate),
  );

  useEffect(() => {
    const id = setInterval(() => {
      const time = calculateTime(updatedAt, timeToUpdate);
      setValue(calculateTime(updatedAt, timeToUpdate));
      if (time >= 100) {
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [timeToUpdate, updatedAt]);

  useEffect(() => {
    if (isLoading) {
      setValue(0);
    }
  }, [isLoading]);

  return (
    <Box
      sx={{
        display: 'grid',
        position: 'relative',
        placeItems: 'center',
        width: 24,
        height: 24,
      }}
      {...other}
    >
      <CircularProgress
        variant="determinate"
        size={24}
        value={100}
        color="info"
        sx={(theme) => ({
          position: 'absolute',
          color: theme.palette.grey[300],
        })}
      />
      <CircularProgress
        variant={isLoading ? 'indeterminate' : 'determinate'}
        size={24}
        value={value}
        sx={{
          opacity: value === 100 && !isLoading ? 0.5 : 1,
        }}
      />
    </Box>
  );
};
