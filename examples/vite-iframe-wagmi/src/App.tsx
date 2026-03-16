import { LiFiWidgetLight } from '@lifi/widget-light'
import { useEthereumIframeHandler } from '@lifi/widget-light/ethereum'
import { useMemo } from 'react'
import { WalletHeader } from './components/WalletHeader'
import { widgetConfig } from './widgetConfig'

export function HostApp() {
  const ethHandler = useEthereumIframeHandler()
  const handlers = useMemo(() => [ethHandler], [ethHandler])

  return (
    <div className="app">
      <WalletHeader />

      <div className="app-content">
        <LiFiWidgetLight
          config={widgetConfig}
          handlers={handlers}
          autoResize={false}
          className="widget-iframe"
          title="LI.FI Widget"
        />
      </div>
    </div>
  )
}
