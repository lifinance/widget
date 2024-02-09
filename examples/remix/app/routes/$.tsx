import { ClientOnly } from 'remix-utils/client-only';
import { Fallback } from '../components/Fallback';
import { LiFiWidget } from '../components/LiFiWidget';

export default function Index() {
  return (
    <ClientOnly fallback={<Fallback />}>{() => <LiFiWidget />}</ClientOnly>
  );
}
