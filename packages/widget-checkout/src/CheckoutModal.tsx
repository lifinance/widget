import type { Theme } from '@mui/material'
import { Box, Modal } from '@mui/material'
import type {
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes,
} from 'react'
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
import { CloseConfirmationDialog } from './components/CloseConfirmationDialog.js'
import { useIsCheckoutBusy } from './hooks/useIsCheckoutBusy.js'
import type { CheckoutModalProps } from './types/config.js'
import type { CheckoutModalRef } from './types/modal.js'

interface CheckoutModalContextValue {
  closeModal: () => void
  openCloseConfirmation: () => void
  panelEl: HTMLDivElement | null
  inline: boolean
}

export const CheckoutModalContext: React.Context<CheckoutModalContextValue | null> =
  createContext<CheckoutModalContextValue | null>(null)

export const useCheckoutModal = (): CheckoutModalContextValue | null => {
  return useContext(CheckoutModalContext)
}

export type { CheckoutModalRef }

export const CheckoutModal: ForwardRefExoticComponent<
  PropsWithChildren<CheckoutModalProps> & RefAttributes<CheckoutModalRef>
> = forwardRef<CheckoutModalRef, PropsWithChildren<CheckoutModalProps>>(
  ({ elementRef, open, onClose, inline, children }, ref) => {
    const openRef = useRef(Boolean(open))
    const [visible, setVisible] = useState(Boolean(open))
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [panelEl, setPanelEl] = useState<HTMLDivElement | null>(null)
    const busy = useIsCheckoutBusy()

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

    const handleModalClose = useCallback(
      (_event: object, reason: 'backdropClick' | 'escapeKeyDown') => {
        if (
          busy &&
          (reason === 'backdropClick' || reason === 'escapeKeyDown')
        ) {
          return
        }
        closePanel()
      },
      [busy, closePanel]
    )

    const handleCancelConfirm = useCallback(() => {
      setConfirmOpen(false)
    }, [])

    const handleConfirmConfirm = useCallback(() => {
      setConfirmOpen(false)
      closePanel()
    }, [closePanel])

    const modalContext: CheckoutModalContextValue = useMemo(
      () => ({
        closeModal: inline ? () => {} : closePanel,
        openCloseConfirmation: inline ? () => {} : () => setConfirmOpen(true),
        panelEl,
        inline: Boolean(inline),
      }),
      [inline, closePanel, panelEl]
    )

    const panel = (
      <Box
        ref={(el: HTMLDivElement | null) => {
          setPanelEl(el)
          if (elementRef) {
            elementRef.current = el
          }
        }}
        tabIndex={-1}
        role="dialog"
        aria-modal={inline ? undefined : 'true'}
        aria-label="Checkout"
        sx={(theme) =>
          inline
            ? {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                outline: 'none',
                width: `min(100%, ${theme.breakpoints.values.sm}px)`,
                maxHeight: 'min(90dvh, 640px)',
                overflow: 'hidden',
                // Inherit only the host widget theme's card *appearance*
                // (radius, shadow/border) so the inline panel matches the
                // standard widget — never its layout props (display/height),
                // which would break the panel's internal scroll.
                background:
                  theme.container?.background ??
                  theme.vars.palette.background.default,
                borderRadius:
                  theme.container?.borderRadius ??
                  theme.vars.shape.borderRadiusTertiary,
                border: theme.container?.border,
                boxShadow: theme.container?.boxShadow,
                filter: theme.container?.filter,
              }
            : {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `min(calc(100vw - 32px), ${theme.breakpoints.values.sm}px)`,
                maxHeight: '90dvh',
                display: 'flex',
                flexDirection: 'column',
                outline: 'none',
                borderRadius: theme.vars.shape.borderRadiusTertiary,
                boxShadow: theme.shadows[24],
                bgcolor: 'background.default',
                overflow: 'hidden',
              }
        }
      >
        {children}
        <CloseConfirmationDialog
          open={confirmOpen}
          onCancel={handleCancelConfirm}
          onConfirm={handleConfirmConfirm}
          container={panelEl}
        />
      </Box>
    )

    return (
      <CheckoutModalContext.Provider value={modalContext}>
        {inline ? (
          panel
        ) : (
          <Modal
            open={visible}
            onClose={handleModalClose}
            keepMounted={false}
            slotProps={
              {
                backdrop: {
                  sx: (theme: Theme) => ({
                    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.48)`,
                  }),
                },
                transition: {
                  timeout: { appear: 0, enter: 160, exit: 80 },
                },
              } as Parameters<typeof Modal>[0]['slotProps']
            }
          >
            {panel}
          </Modal>
        )}
      </CheckoutModalContext.Provider>
    )
  }
)

CheckoutModal.displayName = 'CheckoutModal'
