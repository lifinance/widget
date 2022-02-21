import { DrawerProps } from '@mui/material';
import { RefObject } from 'react';
import { SwapFormDirection } from '../../providers/SwapFormProvider';
import { RouteType } from '../../utils/routes';

export type ContainerDrawerProps = DrawerProps & {
  elementRef?: RefObject<HTMLDivElement>;
  onOpen?(args: any): void;
  route?: RouteType;
};

export interface ContainerDrawerBase {
  openDrawer(formType?: SwapFormDirection, route?: RouteType): void;
  closeDrawer(): void;
}
