import {
  type CheckoutDrawerRef,
  LifiWidgetCheckout,
} from '@lifi/widget-checkout'
import { Box, Button, Typography } from '@mui/material'
import { useCallback, useRef } from 'react'
import { useConfig } from '../../store/widgetConfig/useConfig.js'

export function CheckoutWidgetView() {
  const { config } = useConfig()
  const checkoutRef = useRef<CheckoutDrawerRef>(null)

  const handleOpen = useCallback(() => {
    checkoutRef.current?.open()
  }, [])

  const integrator = config?.integrator ?? 'li.fi-playground'

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
        flex: 1,
        minHeight: 320,
      }}
    >
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Path v1 checkout — opens as a centered widget via ref (
        <code>open()</code> / <code>close()</code>).
      </Typography>
      <Button variant="contained" onClick={handleOpen}>
        Open checkout
      </Button>
      <LifiWidgetCheckout
        ref={checkoutRef}
        integrator={integrator}
        onClose={() => {}}
      />
    </Box>
  )
}
