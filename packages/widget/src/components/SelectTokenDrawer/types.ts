import { SwapFormDirection } from '../../providers/SwapFormProvider';

export interface SelectTokenDrawerBase {
  openDrawer(formType: SwapFormDirection): void;
  closeDrawer(): void;
}

export enum TokenFilterType {
  My,
  All,
}
