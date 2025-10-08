import { EVMProvider } from '@lifi/wallet-provider-evm'
import { MVMProvider } from '@lifi/wallet-provider-mvm'
import { SVMProvider } from '@lifi/wallet-provider-svm'
import { UTXOProvider } from '@lifi/wallet-provider-utxo'
import type { WidgetDrawer } from '@lifi/widget'
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget'
import {
  useConfig,
  useSkeletonToolValues,
  WidgetViewContainer,
} from '@lifi/widget-playground'
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
              EVMProvider(),
              SVMProvider(),
              MVMProvider(),
              UTXOProvider(),
            ]}
            open
          />
        </ClientOnly>
      ) : null}
      {isSkeletonShown ? <WidgetSkeleton config={config!} /> : null}
    </WidgetViewContainer>
  )
}
