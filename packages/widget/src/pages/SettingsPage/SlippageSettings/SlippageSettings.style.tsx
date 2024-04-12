import type { Theme } from '@mui/material';
import {
  Box,
  ButtonBase,
  InputBase,
  alpha,
  inputBaseClasses,
  styled,
} from '@mui/material';
import { getCardFieldsetBackgroundColor } from '../../../utils/colors.js';

export const SettingsFieldSet = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: getCardFieldsetBackgroundColor(theme),
  borderRadius: Math.max(
    theme.shape.borderRadius,
    theme.shape.borderRadiusSecondary,
  ),
  padding: theme.spacing(0.5),
  gap: theme.spacing(0.5),
  height: '3.5rem',
}));

const slippageControlSelected = (theme: Theme) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadiusSecondary,
  boxShadow: `0px 2px 4px ${alpha(theme.palette.common.black, 0.04)}`,
});

interface SlippageDefaultProps {
  selected?: boolean;
}

export const SlippageDefaultButton = styled(ButtonBase)<SlippageDefaultProps>(({
  theme,
  selected,
}) => {
  const selectedStyle = selected
    ? {
        '&:not(:focus)': {
          ...slippageControlSelected(theme),
        },
      }
    : {};

  return {
    height: '100%',
    width: '100%',
    fontSize: '1rem',
    fontWeight: 700,
    '&:focus': {
      ...slippageControlSelected(theme),
    },
    ...selectedStyle,
  };
});

export const SlippageCustomInput = styled(InputBase)<SlippageDefaultProps>(({
  theme,
  selected,
}) => {
  const selectedStyle = selected
    ? {
        '&:not(:focus)': {
          ...slippageControlSelected(theme),
        },
      }
    : {};

  return {
    height: '100%',
    width: '100%',

    [`.${inputBaseClasses.input}`]: {
      height: '100%',
      width: '100%',
      padding: 0,
      textAlign: 'center',
      '&::placeholder': {
        fontSize: '1rem',
        fontWeight: 700,
        opacity: 1,
      },
      '&:focus': {
        ...slippageControlSelected(theme),
      },
      ...selectedStyle,
    },
  };
});

export const SlippageLimitsWarningContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.25),
  marginTop: theme.spacing(1.5),
}));
