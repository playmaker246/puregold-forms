import { createFileRoute } from "@tanstack/react-router";
import { FormFlow } from "@/components/FormFlow";
import { FormShell } from "@/components/FormShell";
import { expressPrintingForm } from "@/lib/forms";

export const Route = createFileRoute("/express-printing/")({
  head: () => ({
    meta: [
      { title: "Express Printing Jobs — Puregold Prints" },
      { name: "description", content: "Request express stickers, business cards, flyers, banners or branded shirts. Puregold Prints will contact you on WhatsApp with your quote." },
      { property: "og:title", content: "Express Printing Jobs — Puregold Prints" },
      { property: "og:description", content: "Send your express printing request to Puregold Prints for an exact price on WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExpressPrintingPage,
});

function ExpressPrintingPage() {
  return <FormShell config={expressPrintingForm}><FormFlow config={expressPrintingForm} /></FormShell>;
}