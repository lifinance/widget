import { Drawer } from '@mui/material';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useScrollableContainer } from '../../hooks';
import type { BottomSheetBase, BottomSheetProps } from './types';

export const BottomSheet = forwardRef<BottomSheetBase, BottomSheetProps>(
  ({ elementRef, children, open }, ref) => {
    const openRef = useRef(open);
    const [drawerOpen, setDrawerOpen] = useState(open);
    const containerElement = useScrollableContainer();

    const openDrawer = useCallback(() => {
      setDrawerOpen(true);
      openRef.current = true;
    }, []);

    const closeDrawer = useCallback(() => {
      setDrawerOpen(false);
      openRef.current = false;
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        isOpen: () => openRef.current,
        openDrawer,
        closeDrawer,
      }),
      [closeDrawer, openDrawer],
    );

    return (
      <Drawer
        container={containerElement}
        ref={elementRef}
        anchor="bottom"
        open={drawerOpen}
        onClose={closeDrawer}
        ModalProps={{
          sx: {
            position: 'absolute',
            overflow: 'hidden',
          },
        }}
        PaperProps={{
          sx: (theme) => ({
            position: 'absolute',
            backgroundImage: 'none',
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
          }),
        }}
        BackdropProps={{
          sx: {
            position: 'absolute',
            backgroundColor: 'rgb(0 0 0 / 48%)',
            backdropFilter: 'blur(3px)',
          },
        }}
        SlideProps={{
          container: containerElement,
        }}
        disableAutoFocus
        disableEnforceFocus
        disableScrollLock
        disablePortal
      >
        {children}
      </Drawer>
    );
  },
);
