import type { DrawerProps } from '@mui/material';
import type { RefObject } from 'react';

export type BottomSheetProps = Omit<DrawerProps, 'onClose'> & {
  elementRef?: RefObject<HTMLDivElement>;
  onClose?(): void;
};

export interface BottomSheetBase {
  isOpen(): void;
  open(): void;
  close(): void;
}
