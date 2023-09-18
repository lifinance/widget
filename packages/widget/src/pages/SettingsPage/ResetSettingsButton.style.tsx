import { getContrastAlphaColor } from '../../utils';
import { Box, Theme, styled } from '@mui/material';

export const ResetButtonContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isCustomRouteSettings'].includes(prop as string),
})<{
  isCustomRouteSettings: boolean;
}>(
  ({
    theme,
    isCustomRouteSettings,
  }: {
    theme: Theme;
    isCustomRouteSettings: boolean;
  }) => ({
    background: getContrastAlphaColor(theme.palette.mode, '4%'),
    borderRadius: '16px',
    padding: `${isCustomRouteSettings ? '16px' : 0}`,

    [`svg`]: {
      fill: getContrastAlphaColor(theme.palette.mode, '40%'),
    },
  }),
);
