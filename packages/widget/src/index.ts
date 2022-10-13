import { App } from './App';
import { AppDrawer } from './AppDrawer';
import './fonts/inter.css';
import { configureReactI18next } from './i18n';

export type { WidgetDrawer } from './AppDrawer';
export { useWidgetEvents } from './hooks';
export * from './types';

configureReactI18next();
// ClassNameGenerator.configure((componentName) =>
//   componentName.replace('Mui', 'LiFi'),
// );

export const LiFiWidget = App;

/**
 * @deprecated Use configuration { variant: 'drawer' } instead
 */
export const LiFiWidgetDrawer = AppDrawer;
