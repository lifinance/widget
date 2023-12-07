export { useFormContext, useWatch } from 'react-hook-form';
export { App as LiFiWidget } from './App';
export type { WidgetDrawer } from './AppDrawer';
export * from './components/NFT';
export * from './config/version';
export {
  useAccount,
  useAvailableChains,
  useWidgetEvents,
  widgetEvents,
} from './hooks';
export * from './providers/FormProvider/types';
export { formatChain } from './providers/WalletProvider';
export * from './types';

// ClassNameGenerator.configure((componentName) =>
//   componentName.replace('Mui', 'LiFi'),
// );
