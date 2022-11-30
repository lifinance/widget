import type { LiFiWidget } from '@lifi/widget';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

export const LiFiWidgetNext = dynamic(
  () => import('../components/Widget').then((module) => module.Widget) as any,
  {
    ssr: false,
  },
) as typeof LiFiWidget;

const Home: NextPage = () => {
  return <LiFiWidgetNext />;
};

export default Home;
