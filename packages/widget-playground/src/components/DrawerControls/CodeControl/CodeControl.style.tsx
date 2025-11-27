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
  zIndex: tooltipPopperZIndex,
  background: theme.vars.palette.grey[200],
  '&:hover': {
    background: theme.vars.palette.grey[300],
  },
  ...theme.applyStyles('dark', {
    background: theme.vars.palette.grey[800],
    '&:hover': {
      background: theme.vars.palette.grey[700],
    },
  }),
}))

export const EditorContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.vars.shape.borderRadius,
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
  backgroundColor: 'transparent',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.vars.palette.common.white,
  }),
}))

export const FontEmbedPopperContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: 450,
  borderRadius: theme.vars.shape.borderRadius,
  gap: theme.spacing(1),
  padding: theme.spacing(4),
  backgroundColor: theme.vars.palette.grey[300],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.vars.palette.grey[700],
  }),
}))

export const GoogleFontLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  color: theme.vars.palette.primary.main,
  textDecorationColor: theme.vars.palette.primary.main,
  ...theme.applyStyles('dark', {
    color: `color-mix(in srgb, ${theme.vars.palette.primary.main} 50%, white)`,
    textDecorationColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 50%, white)`,
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
  backgroundColor: theme.vars.palette.grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.vars.palette.grey[800],
  }),
}))
