import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Drawer } from '@mui/material';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { AppDefault } from './App';
import { DrawerButton, DrawerButtonTypography } from './AppDrawer.style';
import { AppProvider } from './AppProvider';
import type { WidgetConfig, WidgetProps } from './types';

export interface WidgetDrawer {
  isOpen(): void;
  toggleDrawer(): void;
  openDrawer(): void;
  closeDrawer(): void;
}

export const AppDrawer = forwardRef<WidgetDrawer, WidgetProps>(
  ({ elementRef, open, integrator, config }, ref) => {
    const openRef = useRef(open);
    const [drawerOpen, setDrawerOpen] = useState(Boolean(open));

    const toggleDrawer = useCallback(() => {
      setDrawerOpen((open) => !open);
    }, []);

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
        toggleDrawer,
        openDrawer,
        closeDrawer,
      }),
      [closeDrawer, openDrawer, toggleDrawer],
    );

    const widgetConfig: WidgetConfig = useMemo(
      () => ({
        ...config,
        integrator,
        containerStyle: {
          ...config?.containerStyle,
          height: '100%',
        },
      }),
      [config, integrator],
    );

    return (
      <AppProvider config={widgetConfig}>
        <DrawerButton
          variant="contained"
          onClick={toggleDrawer}
          open={drawerOpen}
          drawerProps={config?.containerStyle}
        >
          {drawerOpen ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
          <DrawerButtonText open={drawerOpen} />
        </DrawerButton>
        <Drawer
          ref={elementRef}
          anchor="right"
          open={drawerOpen}
          onClose={closeDrawer}
          BackdropProps={{
            sx: {
              backgroundColor: 'rgb(0 0 0 / 48%)',
              backdropFilter: 'blur(3px)',
            },
          }}
          PaperProps={{
            sx: {
              width: config?.containerStyle?.width ?? '100%',
              minWidth: config?.containerStyle?.minWidth ?? 375,
              maxWidth: config?.containerStyle?.maxWidth ?? 392,
            },
          }}
          keepMounted
        >
          <AppDefault />
        </Drawer>
      </AppProvider>
    );
  },
);

export const DrawerButtonText = ({ open }: { open: boolean }) => {
  const { t } = useTranslation();

  return (
    <DrawerButtonTypography>
      {open ? t('button.hide') : t('button.lifiSwap')}
    </DrawerButtonTypography>
  );
};
