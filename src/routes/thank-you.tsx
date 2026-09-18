import { createFileRoute, Link } from "@tanstack/react-router";

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
          "Your enquiry is in. A Puregold packaging or printing specialist will review your answers and contact you on WhatsApp within 24–48 hours.",
      },
      { property: "og:title", content: "Thanks — We've received your details" },
      {
        property: "og:description",
        content: "A Puregold specialist will contact you on WhatsApp within 24–48 hours.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  const { name, form } = Route.useSearch();
  const specialist = form === "packaging" ? "packaging" : "printing";
  const firstName = (name ?? "").trim().split(" ")[0];

  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-28">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg text-accent-foreground">
        ✓
      </span>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {firstName ? `Thanks, ${firstName}.` : "Thanks."} We've received your details.
      </h1>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
        A {specialist} specialist will review your answers and contact you on WhatsApp within 24–48
        hours.
      </p>
      <p className="mt-8 text-base font-medium text-foreground">While you wait, watch this 1-minute video:</p>

      <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-foreground/95">
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
            ▶
          </span>
          <p className="text-sm text-background/80">Video coming soon</p>
        </div>
      </div>

      <Link
        to="/"
        className="mt-12 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Back to Puregold Forms
      </Link>
    </main>
  );
}
