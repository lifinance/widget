import { Drawer } from '@mui/material';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
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
  const [scrollableContainerElement, setScrollableContainerElement] = useState(
    () => document.getElementById(ElementId.ScrollableContainer),
  );

  const openDrawer = useCallback(
    (formType?: SwapFormDirection, routeKey?: RouteType) => {
      const to = routeKey ? routes[routeKey] : route ? routes[route] : null;
      if (to) {
        navigate(to, { replace: true });
      }
      onOpen?.(formType);
      scrollableContainerElement!.style.overflowY = 'hidden';
      setOpen(true);
    },
    [navigate, onOpen, route, scrollableContainerElement],
  );

  const closeDrawer = useCallback(() => {
    scrollableContainerElement!.style.overflowY = 'scroll';
    setOpen(false);
    navigate(routes.home, { replace: true });
  }, [navigate, scrollableContainerElement]);

  useImperativeHandle(
    ref,
    () => ({
      openDrawer,
      closeDrawer,
    }),
    [closeDrawer, openDrawer],
  );

  useLayoutEffect(() => {
    if (!containerElement) {
      setContainerElement(document.getElementById(ElementId.SwapContent));
    }
  }, [containerElement]);

  useLayoutEffect(() => {
    if (!scrollableContainerElement) {
      setScrollableContainerElement(
        document.getElementById(ElementId.ScrollableContainer),
      );
    }
  }, [scrollableContainerElement]);

  useEffect(() => {
    if (homeMatch && open) {
      setOpen(false);
    }
  }, [homeMatch, open]);

  return (
    <Drawer
      container={containerElement}
      ref={elementRef}
      anchor="right"
      open={open}
      onClose={closeDrawer}
      ModalProps={{
        sx: {
          position: 'absolute',
          // 92px is a height of header
          height: 'calc(100vh - 92px)',
        },
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
