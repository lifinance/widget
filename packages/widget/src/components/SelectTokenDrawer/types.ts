import { DrawerProps } from '@mui/material';
import { RefObject } from 'react';

export type SelectTokenDrawerProps = DrawerProps & {
  containerRef: RefObject<Element>;
  formType: 'from' | 'to';
};

export interface SelectTokenDrawerBase {
  openDrawer(): void;
  closeDrawer(): void;
}
