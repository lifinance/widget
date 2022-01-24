import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/utils';
import { App } from './App';
import './i18n';

ClassNameGenerator.configure((componentName) => componentName.replace('Mui', ''));

export const LiFiWidget = App;
