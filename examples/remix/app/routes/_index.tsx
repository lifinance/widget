import type { MetaFunction } from '@remix-run/node';
import { LiFiWidget } from '../components/LiFiWidget';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  return <LiFiWidget />;
}
