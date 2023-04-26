import { LiFiWidget } from '@lifi/widget';
import { WidgetEvents } from './WidgetEvents';

export const Widget = () => {
  return (
    <>
      <WidgetEvents />
      <LiFiWidget
        config={{
          containerStyle: {
            border: `1px solid rgb(234, 234, 234)`,
            borderRadius: '16px',
          },
        }}
        integrator="nextjs-example"
      />
    </>
  );
};
