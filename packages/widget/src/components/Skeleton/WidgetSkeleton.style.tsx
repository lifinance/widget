import type {
  Theme,
  Components,
  ButtonOwnProps,
  CardProps,
  CSSObject,
} from '@mui/material';
import { Box, Card as MuiCard, Container, styled, Button } from '@mui/material';
import type { WidgetTheme, WidgetVariant } from '@lifi/widget';
import { maxHeight } from '../../components/AppContainer.js';
import { InputCard } from '../../components/Card/InputCard.js';

export const SkeletonRelativeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'skeletonTheme',
})<{ variant?: WidgetVariant; skeletonTheme: Partial<WidgetTheme & Theme> }>(
  ({ variant, skeletonTheme }) => ({
    position: 'relative',
    boxSizing: 'content-box',
    width: '100%',
    minWidth: skeletonTheme.breakpoints?.values.xs,
    maxWidth: skeletonTheme.breakpoints?.values.sm,
    maxHeight: variant === 'drawer' ? 'none' : maxHeight,
    background: skeletonTheme.palette?.background.default,
    overflow: 'auto',
    flex: 1,
    zIndex: 0,
    ...skeletonTheme.container,
  }),
);

export const SkeletonHeaderContainer = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'skeletonTheme',
})<{
  skeletonTheme: Partial<WidgetTheme & Theme>;
}>(({ skeletonTheme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: skeletonTheme.palette?.background.default,
  backdropFilter: 'blur(12px)',
  position: 'relative',
  top: 0,
  zIndex: 1200,
  gap: skeletonTheme.spacing?.(0.5),
  padding: skeletonTheme.spacing?.(1.5, 3, 1.5, 3),
}));

export const SkeletonHeaderAppBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'skeletonTheme',
})<{
  skeletonTheme: Partial<WidgetTheme & Theme>;
}>(({ skeletonTheme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  position: 'relative',
  color: skeletonTheme.palette?.text.primary,
}));

export const SkeletonWalletMenuButtonContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'skeletonTheme',
})<{
  skeletonTheme: Partial<WidgetTheme & Theme>;
}>(({ skeletonTheme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: skeletonTheme.spacing?.(1, 0, 1, 1.5),
  gap: skeletonTheme.spacing?.(1),
}));

type MuiComponents = keyof Components<Theme>;
interface GetComponentStylesProps {
  component: MuiComponents;
  theme: Partial<WidgetTheme & Theme>;
  ownerState: any;
}

const getCardComponentStyles = ({
  component,
  theme,
  ownerState,
}: GetComponentStylesProps) => {
  const componentStyles = theme?.components?.[
    component
  ] as Components<Theme>['MuiCard'];
  const cardVariant = componentStyles?.defaultProps?.variant;

  const variantTheme =
    componentStyles?.variants?.find(
      (variant) =>
        (variant.props as { variant: string }).variant === cardVariant,
    )?.style || {};

  const variantStyle =
    variantTheme instanceof Function
      ? variantTheme({ theme: theme as Theme })
      : variantTheme;

  const rootOverrideTheme = componentStyles?.styleOverrides?.root || {};
  const rootOverrideStyle =
    rootOverrideTheme instanceof Function
      ? rootOverrideTheme({ ownerState, theme: theme as Theme })
      : rootOverrideTheme;

  return {
    ...(variantStyle as object),
    ...(rootOverrideStyle as object),
  } as CSSObject;
};

export const SkeletonCardRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'skeletonTheme',
})<{
  skeletonTheme: Partial<WidgetTheme & Theme>;
}>(({ skeletonTheme }) => ({
  display: 'flex',
  gap: skeletonTheme.spacing?.(2),
  alignItems: 'center',
  marginTop: skeletonTheme.spacing?.(1.5),
}));
interface GetComponentStylesProps {
  component: MuiComponents;
  theme: Partial<WidgetTheme & Theme>;
  ownerState: any;
}

interface SkeletonCardProps extends CardProps {
  skeletonTheme: Partial<WidgetTheme & Theme>;
}

export const SkeletonCard = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'skeletonTheme',
})<SkeletonCardProps>(({ skeletonTheme, ...ownerState }) => {
  const muiCardStyles = getCardComponentStyles({
    component: 'MuiCard',
    theme: skeletonTheme,
    ownerState,
  });

  return {
    padding: skeletonTheme.spacing?.(1.5, 2, 2),
    ...muiCardStyles,
  };
});

export const SkeletonInputCard = styled(InputCard, {
  shouldForwardProp: (prop) => prop !== 'skeletonTheme',
})<SkeletonCardProps>(({ skeletonTheme, ...ownerState }) => {
  const muiCardStyles = getCardComponentStyles({
    component: 'MuiCard',
    theme: skeletonTheme,
    ownerState,
  });
  const muiInputCardStyles = getCardComponentStyles({
    component: 'MuiInputCard',
    theme: skeletonTheme,
    ownerState,
  });

  return {
    padding: skeletonTheme.spacing?.(1.5, 2, 2),
    ...muiCardStyles,
    ...muiInputCardStyles,
  };
});

const getButtonComponentStyles = ({
  component,
  theme,
  ownerState,
}: GetComponentStylesProps) => {
  const componentStyles = theme?.components?.[
    component
  ] as Components<Theme>['MuiButton'];
  const buttonVariant: ButtonOwnProps['variant'] = ownerState.variant || 'text';

  const variantTheme = componentStyles?.styleOverrides?.[buttonVariant!] || {};
  const variantStyle =
    variantTheme instanceof Function
      ? variantTheme({ theme: theme as Theme, ownerState })
      : variantTheme;

  const rootOverrideTheme = componentStyles?.styleOverrides?.root || {};
  const rootOverrideStyle =
    rootOverrideTheme instanceof Function
      ? rootOverrideTheme({ ownerState, theme: theme as Theme })
      : rootOverrideTheme;

  return {
    ...(rootOverrideStyle as object),
    ...(variantStyle as object),
  } as CSSObject;
};

interface SkeletonButtonProps extends ButtonOwnProps {
  skeletonTheme: Partial<WidgetTheme & Theme>;
}
export const SkeletonReviewButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'skeletonTheme',
})<SkeletonButtonProps>(({ skeletonTheme, ...ownerState }) => {
  const muiButtonStyles = getButtonComponentStyles({
    component: 'MuiButton',
    theme: skeletonTheme,
    ownerState,
  });

  return {
    height: 48,
    ...muiButtonStyles,
    '&:disabled': {
      backgroundColor: skeletonTheme.palette?.primary.main,
    },
  };
});
export const SkeletonSendToWalletButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'skeletonTheme',
})<SkeletonButtonProps>(({ skeletonTheme, ...ownerState }) => {
  const muiButtonStyles = getButtonComponentStyles({
    component: 'MuiButton',
    theme: skeletonTheme,
    ownerState,
  });

  return {
    height: 48,
    minWidth: 48,
    width: 48,
    ...muiButtonStyles,
    '&:disabled': {
      backgroundColor:
        muiButtonStyles.backgroundColor || skeletonTheme.palette?.primary.main,
    },
  };
});
