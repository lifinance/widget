export { App as LiFiWidget } from './App.js';
export type { WidgetDrawer } from './AppDrawer.js';
export * from './components/NFT/index.js';
export * from './config/version.js';
export { useAccount } from './hooks/useAccount.js';
export { useAvailableChains } from './hooks/useAvailableChains.js';
export { useWidgetEvents, widgetEvents } from './hooks/useWidgetEvents.js';
export { formatChain } from './providers/WalletProvider/utils.js';
export * from './stores/form/types.js';
export { useFieldActions } from './stores/form/useFieldActions.js';
export { useFieldValues } from './stores/form/useFieldValues.js';
export * from './types/index.js';

// ClassNameGenerator.configure((componentName) =>
//   componentName.replace('Mui', 'LiFi'),
// );
