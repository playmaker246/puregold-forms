import { expect, test } from "bun:test";
import { CUSTOM_QUANTITY, expressPrintingForm, formScreens } from "./forms";
import { expressAnswersSchema } from "./express-validation";

const answers = { name: "Test Person", whatsapp: "08030000000", needPrinted: "Stickers", quantityChoice: "250", design: "Yes, I have it ready", urgent: "Yes, within 1-2 days" };
test("Express always has exactly three screens, including conditional Other on screen 2", () => {
  expect(formScreens(expressPrintingForm, answers).map((s) => s.map((f) => f.id))).toEqual([["name", "whatsapp"], ["needPrinted", "quantityChoice"], ["design", "urgent"]]);
  expect(formScreens(expressPrintingForm, { ...answers, needPrinted: "Other" }).map((s) => s.map((f) => f.id))).toEqual([["name", "whatsapp"], ["needPrinted", "otherPrinted", "quantityChoice"], ["design", "urgent"]]);
});
test("Other requires a specification and stale hidden answers are removed", () => {
  expect(expressAnswersSchema.safeParse({ ...answers, needPrinted: "Other" }).success).toBe(false);
  expect(expressAnswersSchema.parse({ ...answers, needPrinted: "Other", otherPrinted: "Booklets" }).otherPrinted).toBe("Booklets");
  expect(expressAnswersSchema.parse({ ...answers, otherPrinted: "Booklets" }).otherPrinted).toBe("");
});
test("quantity is chosen from product-specific options", () => {
  expect(expressAnswersSchema.parse(answers).quantityChoice).toBe("250");
  expect(expressAnswersSchema.safeParse({ ...answers, quantityChoice: "" }).success).toBe(false);
});
test("custom quantity requires a typed amount, and preset choices clear it", () => {
  const custom = { ...answers, quantityChoice: CUSTOM_QUANTITY, quantity: "3,750" };
  expect(expressAnswersSchema.safeParse({ ...custom, quantity: "" }).success).toBe(false);
  const parsed = expressAnswersSchema.parse(custom);
  expect(parsed.quantity).toBe("3,750");
  expect(parsed.quantityChoice).toBe(CUSTOM_QUANTITY);
  expect(expressAnswersSchema.parse({ ...custom, quantity: "leftover" }).quantity).toBe("");
});
test("WhatsApp is a digit string preserving leading zeros, never exponential notation", () => {
  expect(expressAnswersSchema.parse(answers).whatsapp).toBe("08030000000");
  expect(expressAnswersSchema.safeParse({ ...answers, whatsapp: "8e10" }).success).toBe(false);
});
test("only the requested dropdown choices are accepted", () => {
  for (const key of ["needPrinted", "design", "urgent"]) expect(expressAnswersSchema.safeParse({ ...answers, [key]: "invalid" }).success).toBe(false);
});
