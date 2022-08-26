import type { LiFiWidget } from '@lifi/widget';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const LiFiWidgetDynamic = dynamic(
  () => import('@lifi/widget').then((module) => module.LiFiWidget) as any,
  {
    ssr: false,
  },
) as typeof LiFiWidget;

const Home: NextPage = () => {
  return (
    <LiFiWidgetDynamic
      config={{
        containerStyle: {
          width: 392,
          height: 640,
          border: `1px solid rgb(234, 234, 234)`,
          borderRadius: '16px',
          display: 'flex',
          maxWidth: 392,
        },
      }}
    />
  );
};

export default Home;
