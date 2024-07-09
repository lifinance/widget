import { ClientOnly } from 'remix-utils/client-only';
import { LiFiWidget } from '../components/LiFiWidget';

export default function Index() {
  return <ClientOnly>{() => <LiFiWidget />}</ClientOnly>;
}
