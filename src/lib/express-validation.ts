import { z } from "zod";
import { CUSTOM_QUANTITY, expressPrintingForm } from "./forms";

export const expressAnswersSchema = z
  .object({
    name: z.string().trim().min(1, "Please enter your full name.").max(200),
    whatsapp: z.string().regex(/^[0-9]{7,15}$/, "Please enter a WhatsApp number with 7–15 digits."),
    needPrinted: z.enum(["Stickers", "Business Cards", "Flyers/Posters", "Banners", "Branded Shirts", "Other"]),
    otherPrinted: z.string().trim().max(200).optional(),
    quantityChoice: z.string().trim().min(1, "Please choose the quantity you need.").max(60),
    quantity: z.string().trim().max(200).optional(),
    design: z.enum(["Yes, I have it ready", "No, I need quick design help"]),
    urgent: z.enum(["Yes, within 1-2 days", "No, I can wait a few days"]),
  })
  .superRefine((answers, ctx) => {
    if (answers.needPrinted === "Other" && !answers.otherPrinted) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherPrinted"], message: "Please specify what you need." });
    }
  })
  .superRefine((answers, ctx) => {
    if (answers.quantityChoice === CUSTOM_QUANTITY && !answers.quantity) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["quantity"], message: "Please enter the quantity you need." });
    }
  })
  .transform((answers) => ({
    ...answers,
    otherPrinted: answers.needPrinted === "Other" ? answers.otherPrinted ?? "" : "",
    quantity: answers.quantityChoice === CUSTOM_QUANTITY ? answers.quantity ?? "" : "",
    quantityChoice: answers.needPrinted === "Other" ? `${CUSTOM_QUANTITY}` : answers.quantityChoice,
  }));

export function expressScreenError(answers: Record<string, string>, fieldIds: string[]) {
  const result = expressAnswersSchema.safeParse(answers);
  if (result.success) return null;
  const issue = result.error.issues.find((item) => fieldIds.includes(String(item.path[0])));
  return issue ? (issue.message === "Required" ? `Please answer: ${expressPrintingForm.fields.find((f) => f.id === issue.path[0])?.label ?? "the question above"}.` : issue.message) : null;
}
