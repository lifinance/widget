import { Button as MuiButton, Skeleton, styled } from '@mui/material';

export const MaxButton = styled(MuiButton)(({ theme }) => ({
  padding: theme.spacing(0.5, 1, 0.625, 1),
  lineHeight: 1.0715,
  fontSize: '0.875rem',
  minWidth: 'unset',
}));

export const MaxButtonSkeleton = styled(Skeleton)(({ theme }) => ({
  width: 46,
  height: 24,
  borderRadius: theme.shape.borderRadiusSecondary,
}));
