import { version } from './version';

let sentryLoaded = false;

export const initSentry = async (enabled?: boolean) => {
  if (process.env.NODE_ENV === 'development') {
    return;
  }
  if (enabled || sentryLoaded) {
    const [Sentry, { CaptureConsole }, { BrowserTracing }] = await Promise.all([
      import('@sentry/react'),
      import('@sentry/integrations'),
      import('@sentry/tracing'),
    ]);
    Sentry.init({
      dsn: 'https://bc1312161bf948db9b9c82618035ec22@o1302189.ingest.sentry.io/6539228',
      integrations: [
        new BrowserTracing(),
        new CaptureConsole({
          levels: ['error'],
        }),
      ],
      sampleRate: 0.25,
      tracesSampleRate: 0.2,
      enabled,
      environment: process.env.NODE_ENV,
      release: version,
    });
    sentryLoaded = true;
  }
};
