import { createClient, type SDKClient } from '@lifi/sdk'
import {
  createContext,
  type JSX,
  type PropsWithChildren,
  use,
  useMemo,
} from 'react'
import { version } from '../config/version.js'
import { useWidgetConfig } from './WidgetProvider/WidgetProvider.js'

const SDKClientContext = createContext<SDKClient>({} as SDKClient)

export const useSDKClient = (): SDKClient => use(SDKClientContext)

export const SDKClientProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const {
    sdkConfig,
    apiKey,
    integrator,
    feeConfig,
    referrer,
    routePriority,
    slippage,
  } = useWidgetConfig()

  const client: SDKClient = useMemo(() => {
    return createClient({
      ...sdkConfig,
      apiKey,
      integrator: integrator ?? window?.location.hostname,
      routeOptions: {
        fee: feeConfig?.fee,
        referrer,
        order: routePriority,
        slippage,
        ...sdkConfig?.routeOptions,
      },
      disableVersionCheck: true,
      widgetVersion: version,
    })
  }, [
    sdkConfig,
    apiKey,
    integrator,
    feeConfig,
    referrer,
    routePriority,
    slippage,
  ])

  return <SDKClientContext value={client}>{children}</SDKClientContext>
}
