import { LiFiWidget } from '@lifi/widget';
import { useConfig } from '../../store';
import { WidgetViewContainer } from './WidgetViewContainer';

export function WidgetView() {
  const { config } = useConfig();

  return (
    <WidgetViewContainer>
      <LiFiWidget config={config} integrator="li.fi-playground" open />
    </WidgetViewContainer>
  );
}
