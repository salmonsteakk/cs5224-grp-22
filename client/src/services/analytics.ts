import type { AnalyticsEventPayload } from "@/types";
import { trackAnalyticsEvent, trackAnalyticsEventReliable } from "./api";

const ANALYTICS_QUEUE_STORAGE_KEY = "analytics-event-queue";
const MAX_QUEUED_EVENTS = 100;
const MAX_SEND_ATTEMPTS = 3;

interface QueuedAnalyticsEvent {
  payload: AnalyticsEventPayload;
  critical: boolean;
  attempts: number;
}

let flushInFlight = false;

function readQueue(): QueuedAnalyticsEvent[] {
  const raw = localStorage.getItem(ANALYTICS_QUEUE_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as QueuedAnalyticsEvent[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && item.payload && item.payload.eventType);
  } catch {
    return [];
  }
}

function writeQueue(events: QueuedAnalyticsEvent[]) {
  if (events.length === 0) {
    localStorage.removeItem(ANALYTICS_QUEUE_STORAGE_KEY);
    return;
  }
  localStorage.setItem(ANALYTICS_QUEUE_STORAGE_KEY, JSON.stringify(events.slice(-MAX_QUEUED_EVENTS)));
}

function enqueueEvent(payload: AnalyticsEventPayload, critical: boolean) {
  const queue = readQueue();
  queue.push({ payload, critical, attempts: 0 });
  writeQueue(queue);
}

async function sendEvent(
  token: string,
  payload: AnalyticsEventPayload,
  critical: boolean
): Promise<void> {
  if (critical) {
    await trackAnalyticsEventReliable(token, payload);
    return;
  }
  await trackAnalyticsEvent(token, payload);
}

async function flushQueue(token: string): Promise<void> {
  if (flushInFlight) return;
  flushInFlight = true;

  try {
    const pending = readQueue();
    if (!pending.length) return;

    const remaining: QueuedAnalyticsEvent[] = [];
    for (const event of pending) {
      try {
        await sendEvent(token, event.payload, event.critical);
      } catch {
        const nextAttempt = event.attempts + 1;
        if (nextAttempt < MAX_SEND_ATTEMPTS) {
          remaining.push({ ...event, attempts: nextAttempt });
        } else {
          console.warn("Dropping analytics event after max retries", event.payload.eventType);
        }
      }
    }
    writeQueue(remaining);
  } finally {
    flushInFlight = false;
  }
}

function scheduleFlush(token: string | null) {
  if (!token) return;
  void flushQueue(token);
}

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    const token = localStorage.getItem("auth-token");
    scheduleFlush(token);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      const token = localStorage.getItem("auth-token");
      scheduleFlush(token);
    }
  });
}

export function fireAndForgetAnalytics(token: string | null, payload: AnalyticsEventPayload) {
  enqueueEvent(payload, false);
  if (!token) return;
  void flushQueue(token);
}

export function fireAndForgetCriticalAnalytics(token: string | null, payload: AnalyticsEventPayload) {
  enqueueEvent(payload, true);
  if (!token) return;
  void flushQueue(token).catch(() => {
    // Analytics should never block the learning flow.
    console.warn("Critical analytics queue flush failed", payload.eventType);
  });
}
