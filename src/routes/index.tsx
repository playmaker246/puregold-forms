import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Puregold Prints" },
      {
        name: "description",
        content: "Puregold Prints — printing and food packaging for Nigerian brands.",
      },
      { property: "og:title", content: "Puregold Prints" },
      {
        property: "og:description",
        content: "Puregold Prints — printing and food packaging for Nigerian brands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Puregold Prints</p>
      <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
        Printing & food packaging.
      </h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        If a Puregold specialist sent you a form link, please open that link directly.
      </p>
      <a
        href="https://puregoldprints.com"
        className="mt-10 text-sm text-primary underline-offset-4 hover:underline"
      >
        puregoldprints.com
      </a>
    </main>
  );
}
