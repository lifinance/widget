import { ClientOnly } from 'remix-utils/client-only'
import { Fallback } from '../components/Fallback.js'
import { LiFiWidget } from '../components/LiFiWidget.js'

export default function Index() {
  return <ClientOnly fallback={<Fallback />}>{() => <LiFiWidget />}</ClientOnly>
}
