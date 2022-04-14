import { LiFiWidget, WidgetConfig } from '@lifinance/widget';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { reportWebVitals } from './reportWebVitals';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element.');
}
const root = createRoot(rootElement);

const config: WidgetConfig = {
  enabledChains: JSON.parse(process.env.LIFI_ENABLED_CHAINS_JSON!),
  fromChain: 'eth',
  // toChain: 'okt',
  useInternalWalletManagement: true,
};

root.render(
  <React.StrictMode>
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div
        style={{
          padding: 16,
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </div>
      <div>
        <LiFiWidget config={config} />
      </div>
    </div>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.NODE_ENV === 'development') {
  reportWebVitals(console.log);
}
