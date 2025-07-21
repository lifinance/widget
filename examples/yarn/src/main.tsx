import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { Header } from './components/WalletHeader'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Header />
    <App />
  </React.StrictMode>
)
