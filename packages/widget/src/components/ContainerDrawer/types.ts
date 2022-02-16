import { DrawerProps } from '@mui/material';
import { RefObject } from 'react';
import { SwapFormDirection } from '../../providers/SwapFormProvider';
import { routes } from '../../utils/routes';

export type ContainerDrawerProps = DrawerProps & {
  containerRef: RefObject<Element>;
  elementRef: RefObject<HTMLDivElement>;
  onOpen(args: any): void;
  route: keyof typeof routes;
};

export interface ContainerDrawerBase {
  openDrawer(type: SwapFormDirection): void;
  closeDrawer(): void;
}
