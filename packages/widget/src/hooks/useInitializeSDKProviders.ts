import { useSDKProviders } from '@lifi/widget-provider'
import { useEffect } from 'react'
import { useSDKClient } from '../providers/SDKClientProvider.js'

export const useInitializeSDKProviders = () => {
  const sdkProviders = useSDKProviders()
  const sdkClient = useSDKClient()

  useEffect(() => {
    sdkClient.setProviders(sdkProviders)
  }, [sdkClient, sdkProviders])
}
