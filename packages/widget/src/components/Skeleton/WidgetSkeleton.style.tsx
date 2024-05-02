import { Box, Card as MuiCard, Container, styled, Button } from '@mui/material';
import type { WidgetVariant } from '../../types/widget.js';
import { maxHeight } from '../../components/AppContainer.js';
import { InputCard } from '../../components/Card/InputCard.js';

export const SkeletonRelativeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: WidgetVariant }>(({ variant, theme }) => ({
  position: 'relative',
  boxSizing: 'content-box',
  width: '100%',
  minWidth: theme.breakpoints?.values.xs,
  maxWidth: theme.breakpoints?.values.sm,
  maxHeight: variant === 'drawer' ? 'none' : maxHeight,
  background: theme.palette?.background.default,
  overflow: 'clip',
  flex: 1,
  zIndex: 0,
  ...theme.container,
}));

export const SkeletonHeaderContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette?.background.default,
  backdropFilter: 'blur(12px)',
  position: 'relative',
  top: 0,
  zIndex: 1200,
  gap: theme.spacing?.(0.5),
  padding: theme.spacing?.(1.5, 3, 1.5, 3),
}));

export const SkeletonHeaderAppBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  position: 'relative',
  color: theme.palette?.text.primary,
  paddingRight: theme.navigation?.edge ? 0 : theme.spacing?.(1),
}));

export const SkeletonWalletMenuButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing(1, 0, 1, 1.5),
  gap: theme.spacing(1),
}));

export const SkeletonCardRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  marginTop: theme.spacing(1.5),
}));

export const SkeletonCard = styled(MuiCard)(({ theme }) => {
  return {
    padding: theme.spacing(1.5, 2, 2),
  };
});

export const SkeletonInputCard = styled(InputCard)(({ theme }) => {
  return {
    padding: theme.spacing(1.5, 2, 2),
  };
});

export const SkeletonReviewButton = styled(Button)(({ theme }) => {
  return {
    height: 48,
    pointerEvents: 'none',
  };
});
export const SkeletonSendToWalletButton = styled(Button)(({ theme }) => {
  return {
    height: 48,
    minWidth: 48,
    width: 48,
    pointerEvents: 'none',
  };
});
