import type { ButtonProps } from '@mui/material'
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Link,
  Skeleton as MuiSkeleton,
  styled,
} from '@mui/material'
import { lighten } from '@mui/material/styles'
import { popperZIndex, tooltipPopperZIndex } from '../DrawerControls.style'

export const CodeContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
}))

export const CodeCopyButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(0.5),
  background: theme.palette.grey[800],
  '&:hover': {
    background: theme.palette.grey[700],
    ...theme.applyStyles('light', {
      background: theme.palette.grey[300],
    }),
  },
  zIndex: tooltipPopperZIndex,
  ...theme.applyStyles('light', {
    background: theme.palette.grey[200],
  }),
}))

export const EditorContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  flexGrow: 1,
  height: '100%',
  // This hides the readonly message on the Monaco editor
  '& .monaco-editor-overlaymessage': { display: 'none !important' },
}))

// MUI Button issue when used as a link - https://github.com/mui/material-ui/issues/39287
interface ProjectButton extends ButtonProps {
  target: string
}
export const ProjectButtonBase = styled(Button)<ProjectButton>(({ theme }) => ({
  justifyContent: 'flex-start',
  padding: theme.spacing(1, 3, 1),
  gap: theme.spacing(0.5),
  fontSize: 16,
  textTransform: 'none',
}))

export const ProjectAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: theme.palette.common.white,
  ...theme.applyStyles('light', {
    backgroundColor: 'transparent',
  }),
}))

export const FontEmbedPopperContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: 450,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[700],
  gap: theme.spacing(1),
  padding: theme.spacing(4),
  ...theme.applyStyles('light', {
    backgroundColor: theme.palette.grey[300],
  }),
}))

export const GoogleFontLink = styled(Link)(({ theme }) => ({
  color: lighten(theme.palette.primary.main, 0.5),
  textDecorationColor: lighten(theme.palette.primary.main, 0.5),
  fontWeight: 600,
  ...theme.applyStyles('light', {
    color: theme.palette.primary.main,
    textDecorationColor: theme.palette.primary.main,
  }),
}))

export const FontMessageCloseButton = styled(IconButton)(() => ({
  position: 'absolute',
  right: 0,
  top: 0,
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  width: 32,
  height: 32,
  zIndex: popperZIndex,
}))

export const EditorSkeleton = styled(MuiSkeleton)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  ...theme.applyStyles('light', {
    backgroundColor: theme.palette.grey[100],
  }),
}))
