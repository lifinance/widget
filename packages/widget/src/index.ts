import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/utils';
import { App } from './App';
import { configureReactI18next } from './i18n';

configureReactI18next();
ClassNameGenerator.configure((componentName) => componentName.replace('Mui', ''));

export const LiFiWidget = App;
