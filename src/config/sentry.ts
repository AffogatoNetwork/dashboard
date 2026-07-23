import * as Sentry from "@sentry/react";
import { getCoopByHost } from "../utils/utils";

const dsn =
  process.env.REACT_APP_SENTRY_DSN ||
  "https://f97eb1b1648a820527c714a46b3f8282@o4511786755883008.ingest.de.sentry.io/4511786927652944";

const coop = getCoopByHost(window.location.host);

Sentry.init({
  dsn,
  environment: process.env.NODE_ENV || "development",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  initialScope: {
    tags: {
      platform: "affogato-dashboard",
      cooperative: coop ? coop.name : "default",
    },
  },
});

/**
 * Sets a specific traceability ID (e.g. batch IPFS hash, farmer address, farm ID)
 * and optional metadata on Sentry's active scope for error reports.
 */
export const setTraceabilityId = (traceabilityId: string, extraContext?: Record<string, any>) => {
  Sentry.setTag("traceability_id", traceabilityId);
  if (extraContext) {
    Sentry.setContext("traceability_data", extraContext);
  }
};

export default Sentry;
