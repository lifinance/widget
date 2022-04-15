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
  containerStyle: {
    width: 480,
    height: 640,
    border: '1px solid rgb(234, 234, 234)',
    borderRadius: '16px',
    display: 'flex',
    maxWidth: '480px',
    flex: 1,
  },
};

root.render(
  <React.StrictMode>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <LiFiWidget config={config} />
    </div>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.NODE_ENV === 'development') {
  reportWebVitals(console.log);
}
