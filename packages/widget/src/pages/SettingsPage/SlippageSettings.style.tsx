import { alpha, styled } from '@mui/material/styles';
import { Box, ButtonBase, InputBase, Theme } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';

export const SettingsFieldSet = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.background.paper
      : alpha(theme.palette.common.black, 0.04),
  borderRadius: Math.max(
    theme.shape.borderRadius,
    theme.shape.borderRadiusSecondary,
  ),
  padding: theme.spacing(0.5),
  gap: theme.spacing(0.5),
  height: '3.5rem',
}));

const slippageControlSelected = (theme: Theme) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.background.default
      : theme.palette.common.white,
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
