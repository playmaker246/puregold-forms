import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/express-printing/thank-you")({
  head: () => ({
    meta: [
      { title: "Express Printing Request Received — Puregold Prints" },
      { name: "description", content: "Your express printing request is received. The Puregold Prints team will message you on WhatsApp shortly with your exact price." },
      { property: "og:title", content: "Express Printing Request Received — Puregold Prints" },
      { property: "og:description", content: "Our team is checking your express printing request and will follow up on WhatsApp with your quote." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExpressThankYou,
});

function ExpressThankYou() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-28">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground"><Check aria-hidden className="h-6 w-6" /></span>
      <h1 className="mt-8 text-3xl font-semibold text-foreground sm:text-4xl">You're all set!</h1>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground">Our team is checking your request right now. We will message you on WhatsApp shortly with your exact price.</p>
      <p className="mt-8 text-base leading-relaxed text-muted-foreground">Note: To give you an accurate quote, we will either confirm the exact size you need, or send you a quick catalog of our standard sizes so you can choose.</p>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground">Please save this number so our message doesn't get lost in your requests folder. If your design is ready, you can send it to us right now in the chat!</p>
      <p className="mt-12 text-xs uppercase tracking-[0.25em] text-muted-foreground">Puregold Prints</p>
    </main>
  );
}