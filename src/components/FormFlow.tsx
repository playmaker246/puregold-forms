import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { chunkFields, visibleFields, type FormConfig, type FormField } from "@/lib/forms";
import { submitLead } from "@/lib/submit.functions";
import { logFormEvent } from "@/lib/form-events";

const OTHER = "__other__";

export function FormFlow({ config }: { config: FormConfig }) {
  const navigate = useNavigate();
  const submit = useServerFn(submitLead);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [others, setOthers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const steps = useMemo(() => chunkFields(visibleFields(config, answers)), [config, answers]);
  const current = steps[Math.min(step, steps.length - 1)] ?? [];
  const isLast = step >= steps.length - 1;

  const isPackaging = config.slug === "packaging";
  const reassurance = isPackaging
    ? ["", "Good start — you're on your way.", "You're halfway there.", "Almost through — just a little more information."][
        Math.min(step, 3)
      ]
    : null;
  const nextLabel = isPackaging
    ? step === 0
      ? "Start enquiry"
      : isLast
        ? "Submit enquiry"
        : "Continue"
    : isLast
      ? "Submit"
      : "Next";

  const set = (id: string, value: string) => {
    setAnswers((a) => ({ ...a, [id]: value }));
    setError(null);
  };

  const valueOf = (f: FormField) => {
    if (f.type === "checkbox") {
      const picked = (answers[f.id] ?? "").split(", ").filter(Boolean);
      return picked;
    }
    return answers[f.id] ?? "";
  };

  const missing = current.filter((f) => {
    if (f.optional) return false;
    const v = answers[f.id];
    return !v || !v.trim();
  });

  const track = (name: string) => {
    if (config.slug !== "packaging") return;
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.("event", name, { form: config.slug, total_screens: steps.length });
  };

  const goNext = async () => {
    if (missing.length > 0) {
      setError("Please answer the question(s) above to continue.");
      return;
    }
    if (!isLast) {
      track(`form_screen_${step + 1}_complete`);
      void logFormEvent(`form_screen_${step + 1}_complete`);
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSending(true);
    try {
      const res = await submit({ data: { slug: config.slug, answers } });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      track(`form_screen_${step + 1}_complete`);
      track("form_submit");
      void logFormEvent(`form_screen_${step + 1}_complete`);
      void logFormEvent("form_submit");
      const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
      fbq?.("track", "Lead", {
        content_name: "PureGold Free Sample Request",
        content_category: "Lead Form",
      });
      navigate({ to: "/thank-you", search: { name: res.name, form: config.slug } });
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {isPackaging && step === 0 && (
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground/80">
          Answer a few quick questions so we can understand your business. It takes less than 2 minutes,
          and your answers will help us recommend the best packaging direction for you.
        </p>
      )}
      <div className="flex items-center gap-2" aria-hidden>
        {steps.map((_, i) => (
          <div key={i} className="flex flex-1 items-center gap-2 last:flex-none">
            <span
              className={`h-3 w-3 shrink-0 rounded-full transition-colors ${
                i <= step ? "bg-accent" : "bg-border"
              }`}
            />
            {i < steps.length - 1 && (
              <span className={`h-[2px] flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Step {step + 1} of {steps.length}
      </p>
      {reassurance && (
        <p className="mt-2 text-sm italic text-muted-foreground/80">{reassurance}</p>
      )}

      <div className="mt-6 space-y-5">
        {current.map((f) => (
          <fieldset
            key={f.id}
            className="rounded-xl border border-border bg-card p-5 sm:p-6"
          >
            <legend className="sr-only">{f.label}</legend>
            <h2 className="text-base font-medium text-foreground sm:text-lg">
              {f.label}
              {f.optional && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">(optional)</span>
              )}
            </h2>
            {f.help && <p className="mt-1 text-sm text-muted-foreground">{f.help}</p>}

            <div className="mt-4 space-y-2">
              {(f.type === "text" || f.type === "tel") && (
                <input
                  type={f.type === "tel" ? "tel" : "text"}
                  value={answers[f.id] ?? ""}
                  maxLength={200}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.id, e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
                />
              )}

              {f.type === "textarea" && (
                <textarea
                  rows={4}
                  value={answers[f.id] ?? ""}
                  maxLength={1000}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.id, e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
                />
              )}

              {f.type === "radio" &&
                f.options?.map((opt) => (
                  <label
                    key={opt}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                      answers[f.id] === opt
                        ? "border-primary bg-secondary text-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={f.id}
                      className="accent-primary"
                      checked={answers[f.id] === opt}
                      onChange={() => set(f.id, opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}

              {f.type === "checkbox" &&
                f.options?.map((opt) => {
                  const picked = valueOf(f) as string[];
                  const checked = picked.includes(opt);
                  return (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                        checked ? "border-primary bg-secondary" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={checked}
                        onChange={() => {
                          const next = checked
                            ? picked.filter((p) => p !== opt)
                            : [...picked, opt];
                          set(f.id, next.join(", "));
                        }}
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}

              {f.allowOther && (
                <input
                  type="text"
                  maxLength={200}
                  value={others[f.id] ?? ""}
                  placeholder="Something else — tell us"
                  onChange={(e) => {
                    const text = e.target.value;
                    setOthers((o) => ({ ...o, [f.id]: text }));
                    const base = (answers[f.id] ?? "")
                      .split(", ")
                      .filter((p) => p && !p.startsWith("Other: "))
                      .filter((p) => p !== OTHER);
                    const parts = text.trim() ? [...base, `Other: ${text.trim()}`] : base;
                    set(f.id, f.type === "checkbox" ? parts.join(", ") : parts.slice(-1).join(", "));
                  }}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
                />
              )}
            </div>
          </fieldset>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {isPackaging && isLast && (
        <div className="mt-6 space-y-1 rounded-lg border border-border/60 bg-secondary/40 px-4 py-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            You're almost done. Submit your enquiry and we'll use your answers to prepare for the follow-up.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Almost done. Submit your details and our packaging specialist will contact you to discuss your
            products and the best packaging option.
          </p>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || sending}
          className="text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-0"
        >
          Back
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={sending}
          className="rounded-lg bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition hover:brightness-95 disabled:opacity-60"
        >
          {sending ? "Sending…" : isLast ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}
