import type { Config } from 'wagmi'
import { deepEqual } from 'wagmi'
import type {
  WatchAccountParameters,
  WatchAccountReturnType,
} from 'wagmi/actions'
import { getAccount } from './getAccount.js'

/** https://wagmi.sh/core/api/actions/watchAccount */
export function watchAccount<C extends Config>(
  config: C,
  parameters: WatchAccountParameters<C>
): WatchAccountReturnType {
  const { onChange } = parameters

  return config.subscribe(() => getAccount(config), onChange, {
    equalityFn(a, b) {
      const { connector: aConnector, ...aRest } = a
      const { connector: bConnector, ...bRest } = b
      return (
        deepEqual(aRest, bRest) &&
        // check connector separately
        aConnector?.id === bConnector?.id &&
        aConnector?.uid === bConnector?.uid
      )
    },
  })
}
