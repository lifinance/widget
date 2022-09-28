import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material';
import type { DrawerProps } from '@mui/material';
import { Drawer } from '@mui/material';
import type { RefObject } from 'react';
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
import type { WidgetConfig } from './types';

export type WidgetDrawerProps = DrawerProps & {
  elementRef?: RefObject<HTMLDivElement>;
  config?: WidgetConfig;
};

export interface WidgetDrawer {
  isOpen(): void;
  toggleDrawer(): void;
  openDrawer(): void;
  closeDrawer(): void;
}

export const AppDrawer = forwardRef<WidgetDrawer, WidgetDrawerProps>(
  ({ elementRef, open, config }, ref) => {
    const { t } = useTranslation();
    const openRef = useRef(open);
    const [drawerOpen, setDrawerOpen] = useState(open);

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

    const drawerConfig: WidgetConfig = useMemo(
      () => ({
        ...config,
        containerStyle: {
          ...config?.containerStyle,
          height: '100%',
        },
        variant: 'drawer',
      }),
      [config],
    );

    return (
      <AppProvider config={drawerConfig}>
        <DrawerButton
          variant="contained"
          onClick={toggleDrawer}
          open={drawerOpen}
          drawerProps={config?.containerStyle}
        >
          {drawerOpen ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
          <DrawerButtonTypography>
            {drawerOpen ? t('button.hide') : t('button.lifiSwap')}
          </DrawerButtonTypography>
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
