import {
  Box,
  DialogActions as MuiDialogActions,
  DialogContent as MuiDialogContent,
  DialogContentText as MuiDialogContentText,
  DialogTitle as MuiDialogTitle,
  styled,
} from '@mui/material'

export const DialogContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(4),
}))

export const DialogTitle = styled(MuiDialogTitle)({
  padding: 0,
  fontWeight: 700,
  fontSize: 18,
  lineHeight: 1.3334,
  textAlign: 'center',
})

export const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
  padding: 0,
  marginBottom: theme.spacing(2),
}))

export const DialogActions = styled(MuiDialogActions)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  width: '100%',
  padding: 0,
  '& .MuiButton-root': {
    flex: 1,
    margin: 0,
  },
}))

export const DialogContentText = styled(MuiDialogContentText)(({ theme }) => ({
  padding: 0,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.3334,
  color: theme.vars.palette.text.primary,
}))
