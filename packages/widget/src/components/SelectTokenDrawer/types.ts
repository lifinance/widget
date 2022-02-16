import { SwapFormDirection } from '../../providers/SwapFormProvider';

export interface SelectTokenDrawerBase {
  openDrawer(type: SwapFormDirection): void;
  closeDrawer(): void;
}

export enum TokenFilterType {
  My,
  All,
}
