const GMAIL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

export const TEAM_RECIPIENTS = [
  "ogagabedekemo952@gmail.com",
  "tbedekemo@gmail.com",
  "rubiesfishries@gmail.com",
];

const b64 = (s: string) =>
  btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
const header = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);

export async function notifyTeam(formName: string, rows: { label: string; value: string }[]) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const mailKey = process.env["GOOGLE_MAIL_API_KEY"];
  if (!lovableKey || !mailKey) {
    console.error("Missing Gmail gateway credentials");
    return;
  }
  const subject = `New ${formName} submission`;
  const body = [
    `A new ${formName} form was just submitted and saved to its Google Sheet.`,
    "",
    ...rows.map((r) => `${r.label}\n${r.value || "—"}\n`),
  ].join("\n");
  const raw = b64(
    [
      `To: ${TEAM_RECIPIENTS.join(", ")}`,
      `Subject: ${header(subject)}`,
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="UTF-8"',
      "",
      body,
    ].join("\r\n"),
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await fetch(`${GMAIL}/users/me/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": mailKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) console.error(`Gmail send failed [${res.status}]: ${await res.text()}`);
}
