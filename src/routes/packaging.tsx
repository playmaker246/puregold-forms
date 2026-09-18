import { createFileRoute } from "@tanstack/react-router";
import { FormFlow } from "@/components/FormFlow";
import { packagingForm } from "@/lib/forms";
import { FormShell } from "@/components/FormShell";

export const Route = createFileRoute("/packaging")({
  head: () => ({
    meta: [
      { title: "Food Packaging Enquiry — Puregold Prints" },
      {
        name: "description",
        content:
          "Pouches, jars, labels and printed food packaging from Puregold Prints. Share your goals and a packaging specialist replies on WhatsApp within 24–48 hours.",
      },
      { property: "og:title", content: "Food Packaging Enquiry — Puregold Prints" },
      {
        property: "og:description",
        content: "Tell Puregold Prints about your food brand and get packaging recommendations.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PackagingPage,
});

function PackagingPage() {
  return (
    <FormShell config={packagingForm}>
      <FormFlow config={packagingForm} />
    </FormShell>
  );
}
