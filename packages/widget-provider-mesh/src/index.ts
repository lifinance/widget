import type { OnRampProvider } from '@lifi/widget-provider/checkout'
import { MeshHost } from './MeshHost.js'

export type {
  MeshBalanceResponse,
  MeshBalanceResult,
} from './useMeshBalance.js'
export { useMeshBalance } from './useMeshBalance.js'

export function meshProvider(): OnRampProvider {
  return {
    id: 'mesh',
    fundingCategory: 'exchange',
    name: 'Mesh',
    description: 'Transfer from your exchange account',
    features: ['Coinbase', 'Binance', '300+ Exchanges'],
    // Mesh serves its Link UI (and auto-prewarms its catalog) from here.
    preconnectOrigins: ['https://web.meshconnect.com'],
    Host: MeshHost,
  }
}
