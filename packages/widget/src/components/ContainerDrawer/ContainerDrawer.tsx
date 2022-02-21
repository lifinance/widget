import { Drawer } from '@mui/material';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { SwapFormDirection } from '../../providers/SwapFormProvider';
import { ElementId } from '../../utils/elements';
import { routes, RouteType } from '../../utils/routes';
import { ContainerDrawerBase, ContainerDrawerProps } from './types';

export const ContainerDrawer = forwardRef<
  ContainerDrawerBase,
  ContainerDrawerProps
>(({ elementRef, onOpen, route, children }, ref) => {
  const navigate = useNavigate();
  const homeMatch = useMatch(routes.home);
  const [open, setOpen] = useState(false);
  const [containerElement, setContainerElement] = useState(() =>
    document.getElementById(ElementId.SwapContent),
  );

  const openDrawer = useCallback(
    (formType?: SwapFormDirection, routeKey?: RouteType) => {
      const to = routeKey ? routes[routeKey] : route ? routes[route] : null;
      if (to) {
        navigate(to, { replace: true });
      }
      onOpen?.(formType);
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

  useEffect(() => {
    if (!containerElement) {
      setContainerElement(document.getElementById(ElementId.SwapContent));
    }
  }, [containerElement]);

  return (
    <Drawer
      container={containerElement}
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
      SlideProps={{ container: containerElement }}
    >
      {children}
    </Drawer>
  );
});
