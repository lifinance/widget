import { App } from './App';
import { AppDrawer } from './AppDrawer';
import { initSentry } from './config/sentry';
import './fonts/inter.css';
import { configureReactI18next } from './i18n';

export * from './types';

initSentry(true);
configureReactI18next();
// ClassNameGenerator.configure((componentName) => componentName.replace('Mui', ''));

export const LiFiWidget = App;
export const LiFiWidgetDrawer = AppDrawer;
