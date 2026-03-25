import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

export type TransakPlaceholderDialogProps = {
  open: boolean
  onClose: () => void
  onComplete: () => void
}

export function TransakPlaceholderDialog({
  open,
  onClose,
  onComplete,
}: TransakPlaceholderDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Transak</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Placeholder modal. Integrate Transak SDK and completion callbacks in a
          follow-up.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onComplete}>
          Simulate complete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
