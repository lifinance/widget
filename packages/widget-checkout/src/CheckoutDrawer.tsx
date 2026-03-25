import { Box, Modal } from '@mui/material'
import type { PropsWithChildren } from 'react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  CheckoutDrawerContext,
  type CheckoutDrawerContextValue,
} from './CheckoutDrawerContext.js'
import type {
  CheckoutDrawerProps,
  CheckoutDrawerRef,
} from './types/checkout.js'

export type { CheckoutDrawerRef }

/** Centered checkout panel (modal) — ref API: open / close / isOpen */
export const CheckoutDrawer = forwardRef<
  CheckoutDrawerRef,
  PropsWithChildren<CheckoutDrawerProps>
>(({ elementRef, open, onClose, children }, ref) => {
  const openRef = useRef(Boolean(open))
  const [visible, setVisible] = useState(Boolean(open))

  useEffect(() => {
    if (open !== undefined) {
      setVisible(open)
      openRef.current = open
    }
  }, [open])

  const openPanel = useCallback(() => {
    setVisible(true)
    openRef.current = true
  }, [])

  const closePanel = useCallback(() => {
    setVisible(false)
    openRef.current = false
    onClose?.()
  }, [onClose])

  useImperativeHandle(
    ref,
    () => ({
      isOpen: () => openRef.current,
      open: openPanel,
      close: closePanel,
    }),
    [closePanel, openPanel]
  )

  const drawerContext: CheckoutDrawerContextValue = useMemo(
    () => ({
      closeDrawer: closePanel,
    }),
    [closePanel]
  )

  return (
    <CheckoutDrawerContext.Provider value={drawerContext}>
      <Modal
        open={visible}
        onClose={closePanel}
        keepMounted={false}
        slotProps={
          {
            backdrop: {
              sx: {
                // Avoid backdrop-filter: it repaints every frame during fade and feels sluggish.
                backgroundColor: 'rgba(0, 0, 0, 0.48)',
              },
            },
            // MUI v7 passes this to the Fade transition; typings may omit `transition` on Modal.
            transition: {
              timeout: { appear: 0, enter: 160, exit: 80 },
            },
          } as Parameters<typeof Modal>[0]['slotProps']
        }
      >
        <Box
          ref={elementRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Checkout"
          sx={(theme) => ({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `min(calc(100vw - 32px), ${theme.breakpoints.values.sm}px)`,
            maxHeight: 'min(90dvh, 720px)',
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
            borderRadius: theme.spacing(2),
            boxShadow: theme.shadows[24],
            bgcolor: 'background.paper',
            overflow: 'hidden',
          })}
        >
          {children}
        </Box>
      </Modal>
    </CheckoutDrawerContext.Provider>
  )
})

CheckoutDrawer.displayName = 'CheckoutDrawer'
