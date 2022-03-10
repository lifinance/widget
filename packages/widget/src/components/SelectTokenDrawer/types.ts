import { SwapFormDirection } from '../../providers/SwapFormProvider';
import { RouteType } from '../../utils/routes';

export interface SelectTokenDrawerBase {
  openDrawer(formType: SwapFormDirection, route: RouteType): void;
  closeDrawer(): void;
}

export enum TokenFilterType {
  My,
  All,
}
