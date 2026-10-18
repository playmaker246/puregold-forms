import { describe, expect, test } from "bun:test";
import { buildFormEvent, FORM_EVENT_NAMES, getAnonymousSessionId, SESSION_STORAGE_KEY } from "./form-event-data";

const sessionId = "05f04a16-1834-4d8d-84b1-5234439730f1";

describe("private funnel events", () => {
  test("allows exactly screens 1–5 and submit, not screen 6 or arbitrary events", () => {
    expect(FORM_EVENT_NAMES).toEqual([
      "form_screen_1_complete", "form_screen_2_complete", "form_screen_3_complete",
      "form_screen_4_complete", "form_screen_5_complete", "form_submit",
    ]);
    for (const name of FORM_EVENT_NAMES) {
      expect(buildFormEvent(name, sessionId, "https://forms.test/packaging")?.event_name).toBe(name);
    }
    expect(buildFormEvent("form_screen_6_complete", sessionId, "https://forms.test/packaging")).toBeNull();
    expect(buildFormEvent("unknown", sessionId, "https://forms.test/packaging")).toBeNull();
  });

  test("persists and reuses an anonymous UUID, replacing invalid stored values", () => {
    const values = new Map([[SESSION_STORAGE_KEY, "person@example.com"]]);
    const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); } };
    expect(getAnonymousSessionId(storage, () => sessionId)).toBe(sessionId);
    expect(values.get(SESSION_STORAGE_KEY)).toBe(sessionId);
    expect(getAnonymousSessionId(storage, () => "must-not-be-used")).toBe(sessionId);
  });

  test("captures only the form path and campaign identifiers, never contact query parameters or answers", () => {
    const row = buildFormEvent("form_submit", sessionId, "https://forms.test/printing?utm_source=facebook&utm_medium=paid_social&utm_campaign=october_launch&fbclid=IwABCdef_test&name=Jane&email=jane@example.com&phone=08030000000&answers=secret#Jane");
    expect(row).toEqual({ session_id: sessionId, event_name: "form_submit", page_path: "/printing", utm_source: "facebook", utm_medium: "paid_social", utm_campaign: "october_launch", fbclid: "IwABCdef_test", metadata: {} });
  });

  test("rejects contact-like attribution, arbitrary paths and nonanonymous session IDs", () => {
    const row = buildFormEvent("form_submit", sessionId, "https://forms.test/packaging?utm_source=Jane%20Doe&utm_medium=jane%40example.com&utm_campaign=08030000000");
    expect(row?.utm_source).toBeNull();
    expect(row?.utm_medium).toBeNull();
    expect(row?.utm_campaign).toBeNull();
    expect(buildFormEvent("form_submit", sessionId, "https://forms.test/thank-you?name=Jane")).toBeNull();
    expect(buildFormEvent("form_submit", "jane@example.com", "https://forms.test/packaging")).toBeNull();
  });

  test("bounds campaign tokens to 128 characters and fbclid to 512", () => {
    const row = buildFormEvent("form_submit", sessionId, `https://forms.test/printing?utm_source=${"a".repeat(128)}&utm_medium=${"b".repeat(129)}&utm_campaign=${"c".repeat(129)}&fbclid=${"d".repeat(512)}`);
    expect(row?.utm_source).toBe("a".repeat(128));
    expect(row?.utm_medium).toBeNull();
    expect(row?.utm_campaign).toBeNull();
    expect(row?.fbclid).toBe("d".repeat(512));
    expect(buildFormEvent("form_submit", sessionId, `https://forms.test/printing?fbclid=${"d".repeat(513)}`)?.fbclid).toBeNull();
  });
});