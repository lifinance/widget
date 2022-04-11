import { Button as MuiButton } from '@mui/material';
import { buttonClasses } from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import { SwapFormDirection } from '../../providers/SwapFormProvider';

export const Button = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'formType',
})<{ formType: SwapFormDirection }>(({ theme, formType }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.grey[900],
  color: theme.palette.text.primary,
  // borderRadius:
  //   formType === 'from'
  //     ? `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`
  //     : theme.shape.borderRadius,
  borderRadius:
    formType === 'from'
      ? `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`
      : `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  borderWidth: formType === 'from' ? '2px 2px 1px 2px' : '2px 2px 1px 2px',
  //borderWidth: formType === 'from' ? '2px 2px 1px 2px' : '2px',
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  paddingRight: theme.spacing(1.75),
  textTransform: 'none',
  marginBottom: theme.spacing(-0.125),
  height: '42px',
  [`& .${buttonClasses.endIcon}`]: {
    color: theme.palette.text.secondary,
    flex: 1,
    justifyContent: 'end',
  },
  [`&.${buttonClasses.focusVisible}`]: {
    backgroundColor: `${alpha(theme.palette.primary.main, 0.02)}`,
  },
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.common.white
        : theme.palette.grey[900],
    borderColor: theme.palette.grey[300],
    borderWidth: formType === 'from' ? '2px 2px 1px 2px' : '2px 2px 1px 2px',
    boxShadow: 'none',
  },
  '&:focus': {
    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    backgroundColor: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.primary.main,
    zIndex: 1,
  },
}));
