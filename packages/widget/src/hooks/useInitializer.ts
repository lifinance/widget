import { checkPackageUpdates } from '@lifi/sdk'
import { useEffect } from 'react'
import { name, version } from '../config/version.js'
import { useTools } from './useTools.js'

let checkedPackageUpdates = false

export const useInitializer = () => {
  useTools()
  useEffect(() => {
    if (!checkedPackageUpdates && process.env.NODE_ENV === 'development') {
      checkedPackageUpdates = true
      checkPackageUpdates(name, version)
    }
  }, [])
}
