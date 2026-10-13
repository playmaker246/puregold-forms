import { createFileRoute } from "@tanstack/react-router";

type Search = { name?: string | undefined; form?: string | undefined };

export const Route = createFileRoute("/thank-you")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    name: typeof search["name"] === "string" ? search["name"].slice(0, 80) : undefined,
    form: typeof search["form"] === "string" ? search["form"].slice(0, 40) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Thanks — We've received your details | Puregold Prints" },
      {
        name: "description",
        content:
          "Your details are in. A Puregold printing specialist is reviewing your answers and will contact you on WhatsApp as soon as possible.",
      },
      { property: "og:title", content: "Thanks — We've received your details" },
      {
        property: "og:description",
        content: "A Puregold printing specialist is reviewing your answers and will contact you on WhatsApp as soon as possible.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-28">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg text-accent-foreground">
        ✓
      </span>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Thanks! We've received your details.
      </h1>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
        A printing specialist is reviewing your answers right now to see if your brand is a fit for our services.
      </p>
      <p className="mt-8 text-base font-medium leading-relaxed text-foreground">
        What happens next? We will contact you on WhatsApp as soon as possible.
      </p>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
        If you filled this out during the day, expect a message within a few hours. If you filled this out at night, we will reach out first thing the next morning.
      </p>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
        Please keep your phone nearby. If you don't save our number when we message you, it might go to your 'Message Requests' folder and get lost.
      </p>

      <p className="mt-12 text-xs uppercase tracking-[0.25em] text-muted-foreground">
        Puregold Prints
      </p>
    </main>
  );
}
