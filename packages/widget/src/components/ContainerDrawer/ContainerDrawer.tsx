import { Drawer } from '@mui/material';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { routes } from '../../utils/routes';
import { ContainerDrawerBase, ContainerDrawerProps } from './types';

export const ContainerDrawer = forwardRef<
  ContainerDrawerBase,
  ContainerDrawerProps
>(({ containerRef, elementRef, onOpen, route, children }, ref) => {
  const navigate = useNavigate();
  const homeMatch = useMatch(routes.home);
  const [open, setOpen] = useState(false);

  const openDrawer = useCallback(
    (args) => {
      navigate(routes[route], { replace: true });
      onOpen(args);
      setOpen(true);
    },
    [navigate, onOpen, route],
  );

  const closeDrawer = useCallback(() => {
    setOpen(false);
    navigate(routes.home, { replace: true });
  }, [navigate]);

  useImperativeHandle(
    ref,
    () => ({
      openDrawer,
      closeDrawer,
    }),
    [closeDrawer, openDrawer],
  );

  useEffect(() => {
    if (homeMatch && open) {
      setOpen(false);
    }
  }, [homeMatch, open]);

  return (
    <Drawer
      container={containerRef.current}
      ref={elementRef}
      anchor="right"
      open={open}
      onClose={closeDrawer}
      ModalProps={{
        sx: { position: 'absolute' },
        disablePortal: true,
        keepMounted: true,
      }}
      PaperProps={{
        sx: {
          position: 'absolute',
          width: '85%',
        },
      }}
      BackdropProps={{
        sx: {
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0,0.12)',
          backdropFilter: 'blur(3px)',
        },
      }}
      SlideProps={{ container: containerRef.current }}
    >
      {children}
    </Drawer>
  );
});
