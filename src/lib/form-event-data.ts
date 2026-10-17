export const FORM_EVENT_NAMES = [
  "form_screen_1_complete",
  "form_screen_2_complete",
  "form_screen_3_complete",
  "form_screen_4_complete",
  "form_screen_5_complete",
  "form_submit",
] as const;

export type FormEventName = (typeof FORM_EVENT_NAMES)[number];
export const SESSION_STORAGE_KEY = "puregold_funnel_session_id";
const SESSION_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function isFormEventName(value: string): value is FormEventName {
  return FORM_EVENT_NAMES.some((name) => name === value);
}

export function getAnonymousSessionId(storage: Pick<Storage, "getItem" | "setItem">, uuid: () => string) {
  const existing = storage.getItem(SESSION_STORAGE_KEY);
  if (existing && SESSION_PATTERN.test(existing)) return existing;
  const id = uuid();
  storage.setItem(SESSION_STORAGE_KEY, id);
  return id;
}

// Accept campaign tokens, not arbitrary free text or contact data.
function attributionToken(value: string | null, limit: number): string | null {
  if (!value || value.length > limit || !/^[a-zA-Z0-9_-]+$/.test(value)) return null;
  if (/\d{7,}/.test(value)) return null;
  return value;
}

export function buildFormEvent(eventName: string, sessionId: string, href: string) {
  if (!isFormEventName(eventName) || !SESSION_PATTERN.test(sessionId)) return null;
  const url = new URL(href);
  if (url.pathname !== "/printing" && url.pathname !== "/packaging") return null;
  return {
    session_id: sessionId,
    event_name: eventName,
    page_path: url.pathname,
    utm_source: attributionToken(url.searchParams.get("utm_source"), 128),
    utm_medium: attributionToken(url.searchParams.get("utm_medium"), 128),
    utm_campaign: attributionToken(url.searchParams.get("utm_campaign"), 128),
    fbclid: attributionToken(url.searchParams.get("fbclid"), 512),
    metadata: {},
  };
}