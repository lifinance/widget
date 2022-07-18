/* eslint-disable consistent-return */
import { useEffect } from 'react';
import { initSentry } from '../config/sentry';

export const useTelemetry = (disabled?: boolean) => {
  useEffect(() => {
    if (disabled) {
      console.warn(
        'Enable crash reports and diagnostic data to be collected. This helps us to better understand how the widget is performing and where improvements need to be made.',
      );
    } else {
      initSentry(true);
      return () => {
        initSentry(false);
      };
    }
  }, [disabled]);
};
