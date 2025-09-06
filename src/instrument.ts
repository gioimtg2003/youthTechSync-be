// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from '@sentry/nestjs';
import 'dotenv/config';
console.log(process.env.SENTRY_DNS);
Sentry.init({
  enabled: ['production'].includes(process.env.NODE_ENV),
  environment: process.env.ENVIRONMENT || 'development',
  dsn: process.env.SENTRY_DNS || '',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
