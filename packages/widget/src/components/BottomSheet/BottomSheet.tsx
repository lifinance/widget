import { Drawer } from '@mui/material';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useGetScrollableContainer } from '../../hooks/useScrollableContainer.js';
import { modalProps, paperProps, slotProps } from '../Dialog.js';
import type { BottomSheetBase, BottomSheetProps } from './types.js';

export const BottomSheet = forwardRef<BottomSheetBase, BottomSheetProps>(
  ({ elementRef, children, open, onClose }, ref) => {
    const getContainer = useGetScrollableContainer();
    const openRef = useRef(open);
    const [drawerOpen, setDrawerOpen] = useState(open);

    const close = useCallback(() => {
      setDrawerOpen(false);
      openRef.current = false;
      onClose?.();
    }, [onClose]);

    useImperativeHandle(
      ref,
      () => ({
        isOpen: () => openRef.current,
        open: () => {
          setDrawerOpen(true);
          openRef.current = true;
        },
        close,
      }),
      [close],
    );

    return (
      <Drawer
        container={getContainer}
        ref={elementRef}
        anchor="bottom"
        open={drawerOpen}
        onClose={close}
        ModalProps={modalProps}
        PaperProps={paperProps}
        slotProps={slotProps}
        disableAutoFocus
      >
        {children}
      </Drawer>
    );
  },
);
