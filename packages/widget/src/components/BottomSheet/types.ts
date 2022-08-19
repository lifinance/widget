import type { DrawerProps } from '@mui/material';
import type { RefObject } from 'react';

export type BottomSheetProps = DrawerProps & {
  elementRef?: RefObject<HTMLDivElement>;
};

export interface BottomSheetBase {
  isOpen(): void;
  openDrawer(): void;
  closeDrawer(): void;
}
