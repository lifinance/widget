import { useWidgetConfig } from '..';
import { useTelemetry } from '../../hooks';

export const TelemetryProvider: React.FC<{
  children: React.ReactElement<any, any> | null;
}> = ({ children }) => {
  const config = useWidgetConfig();
  useTelemetry(config?.disableTelemetry);
  return children;
};
