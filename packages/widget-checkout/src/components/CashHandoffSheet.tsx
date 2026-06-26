import {
  Box,
  Button,
  Drawer,
  Stack,
  type Theme,
  Typography,
} from '@mui/material'
import {
  type JSX,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

interface CashHandoffSheetProps {
  open: boolean
  depositAddress: string
  onContinue: () => void
  onGoBack: () => void
  container?: HTMLElement | null
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

const titleId = 'checkout-cash-handoff-title'
const bodyId = 'checkout-cash-handoff-body'

export const CashHandoffSheet: React.FC<CashHandoffSheetProps> = ({
  open,
  depositAddress,
  onContinue,
  onGoBack,
  container,
}): JSX.Element => {
  const { t } = useTranslation()
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
      onGoBack()
    })
  }, [onGoBack])

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
        <Typography id={titleId} variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          {t('checkout.cashHandoff.title')}
        </Typography>
        <Typography
          id={bodyId}
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: 12 }}
        >
          {t('checkout.cashHandoff.body')}
        </Typography>
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}
          >
            {t('checkout.cashHandoff.addressLabel')}
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              mt: 0.5,
              mb: 1,
            }}
          >
            {depositAddress}
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            {t('checkout.cashHandoff.addressHint')}
          </Typography>
        </Box>
        <Stack spacing={1} sx={{ mt: 3 }}>
          <Button variant="contained" autoFocus fullWidth onClick={onContinue}>
            {t('checkout.cashHandoff.continue')}
          </Button>
          <Button
            variant="text"
            fullWidth
            onClick={onGoBack}
            sx={{
              color: 'text.primary',
              fontWeight: 700,
              bgcolor: 'transparent',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            {t('checkout.cashHandoff.goBack')}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  )
}
