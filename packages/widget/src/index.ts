import { App } from './App';
// TODO: remove or make optional
import './fonts/inter.css';

export { useFormContext, useWatch } from 'react-hook-form';
export type { WidgetDrawer } from './AppDrawer';
export * from './components/NFT';
export * from './config/version';
export { useAccount, useWidgetEvents, widgetEvents } from './hooks';
export * from './providers/FormProvider/types';
export * from './types';

// ClassNameGenerator.configure((componentName) =>
//   componentName.replace('Mui', 'LiFi'),
// );

export const LiFiWidget = App;
