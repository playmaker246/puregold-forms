import { supabase } from "@/integrations/supabase/client";
import { buildFormEvent, getAnonymousSessionId, isFormEventName } from "./form-event-data";

// Call only from user actions; tracking failures must never interrupt the form.
export async function logFormEvent(eventName: string): Promise<void> {
  if (typeof window === "undefined" || !isFormEventName(eventName)) return;
  try {
    const sessionId = getAnonymousSessionId(window.localStorage, () => window.crypto.randomUUID());
    const row = buildFormEvent(eventName, sessionId, window.location.href);
    if (!row) return;
    // Do not append .select(): visitors have insert-only permission.
    const { error } = await supabase.from("form_events").insert(row);
    if (error) console.warn("Funnel event could not be saved", error.code);
  } catch {
    console.warn("Funnel tracking unavailable");
  }
}