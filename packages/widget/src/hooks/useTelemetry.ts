import { useEffect } from 'react';
import { initSentry } from '../config/sentry';

export const useTelemetry = (disabled?: boolean) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && disabled) {
      console.warn(
        'Enable crash reports and diagnostic data to be collected. This helps us to better understand how the widget is performing and where improvements need to be made.',
      );
      initSentry(false);
    }
  }, [disabled]);
};
