import { Box, Modal } from '@mui/material'
import type { PropsWithChildren } from 'react'
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { CheckoutModalProps } from './types/config.js'
import type { CheckoutModalRef } from './types/modal.js'

interface CheckoutModalContextValue {
  closeModal: () => void
}

const CheckoutModalContext = createContext<CheckoutModalContextValue | null>(
  null
)

export const useCheckoutModal = (): CheckoutModalContextValue | null => {
  return useContext(CheckoutModalContext)
}

export type { CheckoutModalRef }

export const CheckoutModal = forwardRef<
  CheckoutModalRef,
  PropsWithChildren<CheckoutModalProps>
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

  const modalContext: CheckoutModalContextValue = useMemo(
    () => ({
      closeModal: closePanel,
    }),
    [closePanel]
  )

  return (
    <CheckoutModalContext.Provider value={modalContext}>
      <Modal
        open={visible}
        onClose={closePanel}
        keepMounted={false}
        slotProps={
          {
            backdrop: {
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.48)',
              },
            },
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
    </CheckoutModalContext.Provider>
  )
})

CheckoutModal.displayName = 'CheckoutModal'
