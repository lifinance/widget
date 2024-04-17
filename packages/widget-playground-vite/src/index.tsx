import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { reportWebVitals } from './reportWebVitals';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element.');
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  reportWebVitals(console.log);
}
