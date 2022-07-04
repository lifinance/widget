import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { version } from './version';

export const initSentry = (enabled?: boolean) => {
  Sentry.init({
    dsn: 'https://bc1312161bf948db9b9c82618035ec22@o1302189.ingest.sentry.io/6539228',
    integrations: [
      new BrowserTracing(),
      new CaptureConsole({
        levels: ['error'],
      }),
    ],
    sampleRate: 1,
    tracesSampleRate: 0.2,
    enabled: enabled && process.env.NODE_ENV === 'production',
    environment: process.env.NODE_ENV,
    release: version,
  });
};
