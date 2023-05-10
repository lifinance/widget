/* eslint-disable import/no-default-export */
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { LoadingIndicator } from '../components/LoadingIndicator';

export const LiFiWidgetNext = dynamic(
  () => import('../components/Widget').then((module) => module.Widget) as any,
  {
    ssr: false,
    loading: () => <LoadingIndicator />,
  },
);

const Home: NextPage = () => {
  return <LiFiWidgetNext />;
};

export default Home;
