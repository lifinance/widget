import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const MultisigWalletAlertContainer = styled(Box)(({ theme }) => ({
  backgroundColor: `${alpha(theme.palette.info.main, 0.12)}`,
  padding: theme.spacing(2),
  boxShadow: `0px 2px 4px ${alpha(theme.palette.common.black, 0.04)}`,
  borderRadius: theme.shape.borderRadius,
  maxWidth: '392px',
  margin: '0 auto 2rem auto',
}));

export const MultisigWalletAlertTitle = styled(Box)(({ theme }) => ({
  color: theme.palette.info.main,
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.875rem',
}));

export const MultisigWalletAlertContent = styled(Box)(({ theme }) => ({
  fontSize: '0.875rem',
}));
