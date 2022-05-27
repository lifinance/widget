import { Drawer } from '@mui/material';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useScrollableContainer } from '../../hooks';
import { BottomSheetBase, BottomSheetProps } from './types';

export const BottomSheet = forwardRef<BottomSheetBase, BottomSheetProps>(
  ({ elementRef, children, open }, ref) => {
    const openRef = useRef(open);
    const [drawerOpen, setDrawerOpen] = useState(open);
    const containerElement = useScrollableContainer();

    const openDrawer = useCallback(() => {
      setDrawerOpen(true);
    }, []);

    const closeDrawer = useCallback(() => {
      setDrawerOpen(false);
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
          // disablePortal: true,
          keepMounted: true,
        }}
        PaperProps={{
          sx: (theme) => ({
            position: 'absolute',
            backgroundImage: 'none',
            borderTopLeftRadius: (theme.shape.borderRadius as number) * 2,
            borderTopRightRadius: (theme.shape.borderRadius as number) * 2,
          }),
          // elevation: 5,
        }}
        BackdropProps={{
          sx: (theme) => ({
            position: 'absolute',
            backgroundColor: 'rgb(0 0 0 / 48%)',
            backdropFilter: 'blur(3px)',
          }),
        }}
        SlideProps={{
          container: containerElement,
        }}
      >
        {children}
      </Drawer>
    );
  },
);
