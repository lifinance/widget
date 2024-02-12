import { Box, alpha, darken, lighten, styled } from '@mui/material';
import {
  getInfoBackgroundColor,
  getWarningBackgroundColor,
} from '../../utils/colors.js';
import type { Severity } from './types.js';

interface AlertSeverityProps {
  severity: Severity;
}

export const AlertMessageCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'severity',
})<AlertSeverityProps>(({ theme, severity }) => ({
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  whiteSpace: 'pre-line',
  width: '100%',
  paddingBottom: theme.spacing(2),
  backgroundColor:
    severity === 'warning'
      ? getWarningBackgroundColor(theme)
      : getInfoBackgroundColor(theme),
}));

export const AlertMessageCardTitle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'severity',
})<AlertSeverityProps>(({ theme, severity }) => ({
  display: 'flex',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(2),
  gap: theme.spacing(1),
  color:
    severity === 'warning'
      ? theme.palette.mode === 'light'
        ? darken(theme.palette.warning.main, 0.36)
        : alpha(theme.palette.warning.main, 1)
      : theme.palette.mode === 'light'
        ? theme.palette.info.main
        : lighten(theme.palette.info.main, 0.24),
}));
