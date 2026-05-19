import type { OnRampProvider } from '@lifi/widget-provider/checkout'
import { TransakHost } from './TransakHost.js'

export function transakProvider(): OnRampProvider {
  return {
    id: 'transak',
    fundingCategory: 'cash',
    name: 'Transak',
    description: 'Buy crypto with card or bank transfer',
    features: ['Visa/Mastercard', 'Bank Transfer', '170+ Countries'],
    recommended: true,
    Host: TransakHost,
  }
}
