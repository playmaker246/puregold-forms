import type { ReactNode } from "react";
import type { FormConfig } from "@/lib/forms";

export function FormShell({ config, children }: { config: FormConfig; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14 sm:py-20">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Puregold Prints</p>
      <p className="mt-10 text-xs uppercase tracking-[0.3em] text-accent-foreground/70">{config.kicker}</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {config.title}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{config.blurb}</p>
      <div className="mt-12">{children}</div>
    </main>
  );
}
