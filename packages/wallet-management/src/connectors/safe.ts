import type { SafeAppProvider } from '@safe-global/safe-apps-provider'
import type { CreateConnectorFn } from 'wagmi'
import { safe as _safe } from 'wagmi/connectors'

export const safe: CreateConnectorFn<
  SafeAppProvider | undefined,
  Record<string, unknown>,
  {
    'safe.disconnected': true
  }
> = /*#__PURE__*/ _safe()
