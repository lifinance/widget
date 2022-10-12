import { App } from './App';
import { AppDrawer } from './AppDrawer';
import './fonts/inter.css';

export type { WidgetDrawer, WidgetDrawerProps } from './AppDrawer';
export { useWidgetEvents } from './hooks';
export * from './types';

// ClassNameGenerator.configure((componentName) =>
//   componentName.replace('Mui', 'LiFi'),
// );

export const LiFiWidget = App;
export const LiFiWidgetDrawer = AppDrawer;
