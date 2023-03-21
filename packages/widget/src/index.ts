import { App } from './App';
// TODO: remove or make optional
import './fonts/inter.css';

export type { WidgetDrawer } from './AppDrawer';
export * from './components/NFT';
export * from './config/version';
export { useWidgetEvents, widgetEvents } from './hooks';
export { useWallet } from './providers/WalletProvider';
export * from './types';

// ClassNameGenerator.configure((componentName) =>
//   componentName.replace('Mui', 'LiFi'),
// );

export const LiFiWidget = App;
