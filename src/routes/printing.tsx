import { createFileRoute } from "@tanstack/react-router";
import { FormFlow } from "@/components/FormFlow";
import { printingForm } from "@/lib/forms";
import { FormShell } from "@/components/FormShell";

export const Route = createFileRoute("/printing")({
  head: () => ({
    meta: [
      { title: "General Printing Enquiry — Puregold Prints" },
      {
        name: "description",
        content:
          "Request business cards, flyers, banners, stickers or event materials from Puregold Prints. Answer a few questions and get a WhatsApp reply within 24–48 hours.",
      },
      { property: "og:title", content: "General Printing Enquiry — Puregold Prints" },
      {
        name: "og:description",
        content: "Tell Puregold Prints what you need printed and a specialist will follow up on WhatsApp.",
      },
    ],
  }),
  component: PrintingPage,
});

function PrintingPage() {
  return (
    <FormShell config={printingForm}>
      <FormFlow config={printingForm} />
    </FormShell>
  );
}
