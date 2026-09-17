import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Puregold Forms — Printing & Packaging Enquiries" },
      {
        name: "description",
        content:
          "Start a printing or food packaging enquiry with Puregold Prints. Answer a few short questions and a specialist reaches you on WhatsApp within 24–48 hours.",
      },
      { property: "og:title", content: "Puregold Forms — Printing & Packaging Enquiries" },
      {
        property: "og:description",
        content:
          "Two short forms: general printing and food packaging. A Puregold specialist reviews your answers and contacts you on WhatsApp.",
      },
    ],
  }),
  component: Index,
});

const sections = [
  {
    to: "/printing" as const,
    label: "01",
    title: "General Printing",
    text: "Business cards, flyers, banners, stickers, event materials.",
  },
  {
    to: "/packaging" as const,
    label: "02",
    title: "Food Packaging",
    text: "Pouches, jars, labels and printed packaging for food brands.",
  },
];

function Index() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Puregold Prints</p>
      <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
        Tell us what you need.
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
        Pick the form that fits your project. It takes about two minutes — a couple of questions per
        screen, nothing more. A specialist reviews your answers and reaches you on WhatsApp within
        24–48 hours.
      </p>

      <div className="mt-14 divide-y divide-border border-y border-border">
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="group flex items-center gap-6 py-8 transition-colors hover:bg-secondary/60"
          >
            <span className="text-sm text-accent-foreground/70">{s.label}</span>
            <span className="flex-1">
              <span className="block text-xl font-medium text-foreground">{s.title}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{s.text}</span>
            </span>
            <span className="text-primary transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
