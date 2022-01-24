import { LiFiWidget } from '@lifinance/widget';
import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/utils';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { reportWebVitals } from './reportWebVitals';

ClassNameGenerator.configure((componentName) => componentName.replace('Mui', ''));

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element.');
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <LiFiWidget />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.NODE_ENV === 'development') {
  reportWebVitals(console.log);
}
