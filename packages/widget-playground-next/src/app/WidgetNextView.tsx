import type { WidgetDrawer } from '@lifi/widget'
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget'
import {
  useConfig,
  useSkeletonToolValues,
  WidgetViewContainer,
} from '@lifi/widget-playground'
import { BitcoinProvider } from '@lifi/widget-provider-bitcoin'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import { SolanaProvider } from '@lifi/widget-provider-solana'
import { SuiProvider } from '@lifi/widget-provider-sui'
import { useCallback, useRef } from 'react'
import { ClientOnly } from './ClientOnly.js'

export function WidgetNextView() {
  const { config } = useConfig()
  const drawerRef = useRef<WidgetDrawer>(null)
  const { isSkeletonShown, isSkeletonSideBySide } = useSkeletonToolValues()

  const toggleDrawer = useCallback(() => {
    drawerRef?.current?.toggleDrawer()
  }, [])

  return (
    <WidgetViewContainer toggleDrawer={toggleDrawer}>
      {!isSkeletonShown || isSkeletonSideBySide ? (
        <ClientOnly fallback={<WidgetSkeleton config={config} />}>
          <LiFiWidget
            config={config}
            integrator="li.fi-playground"
            ref={drawerRef}
            providers={[
              EthereumProvider(),
              SolanaProvider(),
              SuiProvider(),
              BitcoinProvider(),
            ]}
            open
          />
        </ClientOnly>
      ) : null}
      {isSkeletonShown ? <WidgetSkeleton config={config!} /> : null}
    </WidgetViewContainer>
  )
}
