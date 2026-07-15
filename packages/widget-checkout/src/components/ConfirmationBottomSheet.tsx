import {
  Box,
  Button,
  Drawer,
  Stack,
  type Theme,
  Typography,
} from '@mui/material'
import {
  type ReactNode,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from 'react'

interface ConfirmationBottomSheetProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  title: ReactNode
  body: ReactNode
  cancelLabel: ReactNode
  confirmLabel: ReactNode
  container?: HTMLElement | null
  titleId?: string
  bodyId?: string
}

const modalSx = {
  position: 'absolute' as const,
  inset: 0,
  overflow: 'hidden',
}

const paperSx = (theme: Theme) => ({
  position: 'absolute' as const,
  backgroundImage: 'none',
  backgroundColor: theme.vars.palette.background.default,
  borderTopLeftRadius: theme.vars.shape.borderRadius,
  borderTopRightRadius: theme.vars.shape.borderRadius,
})

const backdropSx = {
  position: 'absolute' as const,
  inset: 0,
  backgroundColor: 'rgb(0 0 0 / 32%)',
  backdropFilter: 'blur(3px)',
}

export const ConfirmationBottomSheet: React.FC<
  ConfirmationBottomSheetProps
> = ({
  open,
  onCancel,
  onConfirm,
  title,
  body,
  cancelLabel,
  confirmLabel,
  container,
  titleId,
  bodyId,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(open)
  const [isInert, setIsInert] = useState(!open)

  useEffect(() => {
    if (open) {
      setIsInert(false)
      setDrawerOpen(true)
    } else {
      setIsInert(true)
      startTransition(() => setDrawerOpen(false))
    }
  }, [open])

  const handleClose = useCallback(() => {
    setIsInert(true)
    startTransition(() => {
      setDrawerOpen(false)
      onCancel()
    })
  }, [onCancel])

  return (
    <Drawer
      container={container ?? undefined}
      anchor="bottom"
      open={drawerOpen}
      onClose={handleClose}
      ModalProps={{ sx: modalSx }}
      slotProps={{
        paper: {
          sx: paperSx,
          'aria-labelledby': titleId,
          'aria-describedby': bodyId,
        },
        backdrop: { sx: backdropSx },
      }}
      disableAutoFocus
      inert={isInert}
    >
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography id={titleId} variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography id={bodyId} variant="body2" color="text.secondary">
          {body}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
          <Button variant="contained" autoFocus fullWidth onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="text" fullWidth onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  )
}
