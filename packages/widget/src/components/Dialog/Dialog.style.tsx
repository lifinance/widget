import {
  Box,
  DialogActions as MuiDialogActions,
  DialogContent as MuiDialogContent,
  DialogContentText as MuiDialogContentText,
  DialogTitle as MuiDialogTitle,
  styled,
} from '@mui/material'
import type React from 'react'

export const DialogContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(4),
  }))

export const DialogTitle: React.FC<
  React.ComponentProps<typeof MuiDialogTitle>
> = styled(MuiDialogTitle)({
  padding: 0,
  fontWeight: 700,
  fontSize: 18,
  lineHeight: 1.3334,
  textAlign: 'center',
})

export const DialogContent: React.FC<
  React.ComponentProps<typeof MuiDialogContent>
> = styled(MuiDialogContent)(({ theme }) => ({
  padding: 0,
  marginBottom: theme.spacing(2),
}))

export const DialogActions: React.FC<
  React.ComponentProps<typeof MuiDialogActions>
> = styled(MuiDialogActions)(({ theme }) => ({
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

export const DialogContentText: React.FC<
  React.ComponentProps<typeof MuiDialogContentText>
> = styled(MuiDialogContentText)(({ theme }) => ({
  padding: 0,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.3334,
  color: theme.vars.palette.text.primary,
}))
