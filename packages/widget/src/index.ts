import { App } from './App';
import { configureLiFi } from './config/lifi';
import { configureReactI18next } from './i18n';

export * from './types';

configureLiFi();
configureReactI18next();
// ClassNameGenerator.configure((componentName) => componentName.replace('Mui', ''));

export const LiFiWidget = App;
