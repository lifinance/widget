import { useAppKit } from '@reown/appkit/react'
import { useEffect } from 'react'
import { useWidgetConfigStore } from '../../store/widgetConfig/WidgetConfigProvider'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions'

export const WidgetWalletConfigUpdater = () => {
  const { open } = useAppKit()
  const { setWalletConfig } = useConfigActions()
  const walletConfig = useWidgetConfigStore(
    (store) => store.config?.walletConfig
  )

  useEffect(() => {
    // Due to provider constraints, we're unable to directly assign an onConnect function
    // that opens the external wallet management directly from the widget playground settings component.
    // To work around this limitation, we employ a temporary "hack" by initially setting an empty function.
    // This allows us to later replace it with the intended functionality.
    const onConnectStringified = walletConfig?.onConnect
      ?.toString()
      .replaceAll(' ', '')
    if (onConnectStringified === '()=>{}') {
      setWalletConfig({
        ...walletConfig,
        onConnect: () => {
          open()
        },
      })
    }
  }, [setWalletConfig, walletConfig, open])

  return null
}
