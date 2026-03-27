import type { AnalyticsEventPayload } from "@/types";
import { trackAnalyticsEvent, trackAnalyticsEventReliable } from "./api";

export function fireAndForgetAnalytics(token: string | null, payload: AnalyticsEventPayload) {
  if (!token) return;
  void trackAnalyticsEvent(token, payload).catch(() => {
    // Analytics should not block the learning flow.
  });
}

export function fireAndForgetCriticalAnalytics(token: string | null, payload: AnalyticsEventPayload) {
  if (!token) return;
  void (async () => {
    try {
      await trackAnalyticsEventReliable(token, payload);
      return;
    } catch {
      // Retry once for transient network failures.
    }

    try {
      await trackAnalyticsEventReliable(token, payload);
    } catch {
      // Analytics should never block the learning flow.
      console.warn("Critical analytics event failed", payload.eventType);
    }
  })();
}
