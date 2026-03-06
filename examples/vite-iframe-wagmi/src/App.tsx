import { LiFiWidgetLight } from '@lifi/widget-light'
import { useEthereumIframeHandler } from '@lifi/widget-light/ethereum'
import { useMemo } from 'react'
import { WalletHeader } from './components/WalletHeader'
import { widgetConfig } from './widgetConfig'

const WIDGET_URL = import.meta.env.VITE_WIDGET_URL || 'https://widget.li.fi'
const WIDGET_ORIGIN = new URL(WIDGET_URL).origin

export function HostApp() {
  const ethHandler = useEthereumIframeHandler()
  const handlers = useMemo(() => [ethHandler], [ethHandler])

  return (
    <div className="app">
      <WalletHeader />

      <div className="app-content">
        <LiFiWidgetLight
          src={WIDGET_URL}
          config={widgetConfig}
          handlers={handlers}
          iframeOrigin={WIDGET_ORIGIN}
          autoResize={false}
          className="widget-iframe"
          title="LI.FI Widget"
        />
      </div>
    </div>
  )
}
