import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { forms } from "./forms";

const SPREADSHEET_ID = "1QIZO8oGTTWIF4P8tUDxSM_znDJ6uFxu-k4U9umhr1vQ";
const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

const schema = z.object({
  slug: z.enum(["printing", "packaging"]),
  answers: z.record(z.string(), z.string().max(1000)),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const config = forms[data.slug];
    const answers = data.answers;

    const name = (answers["name"] ?? "").trim();
    const whatsapp = (answers["whatsapp"] ?? "").trim();
    const business = (answers["business"] ?? "").trim();
    if (!name || !whatsapp || !business) {
      return { ok: false as const, error: "Name, WhatsApp number and business name are required." };
    }

    const row = [
      new Date().toISOString(),
      ...config.fields.map((f) => (answers[f.id] ?? "").toString().slice(0, 1000)),
    ];

    const lovableKey = process.env["LOVABLE_API_KEY"];
    const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];
    if (!lovableKey || !connectionKey) {
      console.error("Missing gateway credentials for Google Sheets");
      return { ok: false as const, error: "Submissions are not configured yet. Please try again later." };
    }

    const res = await fetch(
      `${GATEWAY}/spreadsheets/${SPREADSHEET_ID}/values/${config.tab}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": connectionKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: [row] }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error(`Sheets append failed [${res.status}]: ${body}`);
      return { ok: false as const, error: "We couldn't save your answers. Please try again." };
    }

    return { ok: true as const, name };
  });
