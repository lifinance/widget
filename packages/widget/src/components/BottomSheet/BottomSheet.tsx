import { Drawer } from '@mui/material'
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useGetScrollableContainer } from '../../hooks/useScrollableContainer.js'
import { modalProps, slotProps } from '../Dialog.js'
import type { BottomSheetBase, BottomSheetProps } from './types.js'

export const BottomSheet = forwardRef<BottomSheetBase, BottomSheetProps>(
  ({ elementRef, children, open, onClose }, ref) => {
    const getContainer = useGetScrollableContainer()
    const openRef = useRef(open)
    const [drawerOpen, setDrawerOpen] = useState(open)
    const [isInert, setIsInert] = useState(!open)

    const close = useCallback(() => {
      // Set inert first to prevent focus issues
      setIsInert(true)
      // Push the state update to the next event loop tick
      // to ensure the inert is applied to before the drawer is closed
      setTimeout(() => {
        setDrawerOpen(false)
        openRef.current = false
        onClose?.()
      }, 0) // NB: no cleanup - executes immediately (no time to unmount to cause a memory leak)
    }, [onClose])

    useImperativeHandle(
      ref,
      () => ({
        isOpen: () => openRef.current,
        open: () => {
          setIsInert(false)
          setDrawerOpen(true)
          openRef.current = true
        },
        close,
      }),
      [close]
    )

    return (
      <Drawer
        container={getContainer}
        ref={elementRef}
        anchor="bottom"
        open={drawerOpen}
        onClose={close}
        ModalProps={modalProps}
        slotProps={slotProps}
        disableAutoFocus
        keepMounted={true}
        inert={isInert}
      >
        {children}
      </Drawer>
    )
  }
)
