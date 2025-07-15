// biome-ignore assist/source/organizeImports: should be at the top
import { scan } from 'react-scan'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'
import { reportWebVitals } from './reportWebVitals'

scan({
  enabled: true,
})

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element.')
}

const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (import.meta.env.DEV) {
  // biome-ignore lint/suspicious/noConsole: allowed in dev
  reportWebVitals(console.log)
}
