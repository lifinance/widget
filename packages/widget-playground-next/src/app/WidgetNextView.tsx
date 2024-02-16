import dynamic from 'next/dynamic';
import {
  useConfig,
  WidgetSkeleton,
  WidgetViewContainer,
} from '@lifi/widget-playground';

const LiFiWidgetLazyLoaded = dynamic(
  () => import('@lifi/widget').then((module) => module.LiFiWidget),
  {
    loading: () => <WidgetSkeleton />,
    ssr: false,
  },
);

export function WidgetNextView() {
  const { config } = useConfig();

  return (
    <WidgetViewContainer>
      <LiFiWidgetLazyLoaded
        config={config}
        integrator="li.fi-playground"
        open
      />
    </WidgetViewContainer>
  );
}
