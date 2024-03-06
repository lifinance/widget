import { Box, Button, ButtonProps, IconButton, styled } from '@mui/material';
import { tooltipPopperZIndex } from '../DrawerControls.style';

export const CodeContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
}));

export const CodeCopyButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(0.5),
  background:
    theme.palette.mode === 'light'
      ? theme.palette.grey[200]
      : theme.palette.grey[800],
  '&:hover': {
    background:
      theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
  },
  zIndex: tooltipPopperZIndex,
}));

export const EditorContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  flexGrow: 1,
  height: '100%',
  // This hides the readonly message on the Monaco editor
  '& .monaco-editor-overlaymessage': { display: 'none !important' },
}));

// MUI Button issue when used as a link - https://github.com/mui/material-ui/issues/39287
interface ProjectButton extends ButtonProps {
  target: string;
}
export const ProjectButton = styled(Button)<ProjectButton>(({ theme }) => ({
  justifyContent: 'flex-start',
  padding: theme.spacing(1, 3, 1),
  gap: theme.spacing(0.5),
}));
