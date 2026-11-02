import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { forms } from "./forms";
import { expressAnswersSchema } from "./express-validation";

const SPREADSHEET_IDS = {
  printing: "1ofcn-E4yJA5yzdOz5nAKnNzG6c73Dx9v-2MN1jofLsk",
  packaging: "1swB1TZG8qc0wrmkx-923GXmg6sNnH24eGZbTfxH5Zxw",
  "express-printing": "1HE4NuScKFlILSe9RfXe0zJVN8TDKiHploxnUag_ctt8",
} as const;
const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

const schema = z.object({
  slug: z.enum(["printing", "packaging", "express-printing"]),
  answers: z.record(z.string(), z.string().max(1000)),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const config = forms[data.slug];
    let answers: Record<string, string> = data.answers;
    if (data.slug === "express-printing") {
      const validated = expressAnswersSchema.safeParse(answers);
      if (!validated.success) {
        return { ok: false as const, error: validated.error.issues[0]?.message ?? "Please check your answers." };
      }
      answers = validated.data;
    }

    const name = (answers["name"] ?? "").trim();
    const whatsapp = (answers["whatsapp"] ?? "").trim();
    const business = (answers["business"] ?? "").trim();
    if (!name || !whatsapp || (data.slug !== "express-printing" && !business)) {
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
      `${GATEWAY}/spreadsheets/${SPREADSHEET_IDS[data.slug]}/values/${config.tab}!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
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

    try {
      const { notifyTeam } = await import("./notify.server");
      await notifyTeam(
        config.title,
        config.fields.map((f) => ({ label: f.label, value: (answers[f.id] ?? "").toString() })),
      );
    } catch (e) {
      console.error("Team notification failed", e);
    }

    return { ok: true as const, name };
  });
