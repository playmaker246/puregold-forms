import { expect, test } from "bun:test";
import { expressPrintingForm, formScreens } from "./forms";
import { expressAnswersSchema } from "./express-validation";

const answers = { name: "Test Person", whatsapp: "08030000000", needPrinted: "Stickers", quantity: "200", design: "Yes, I have it ready", urgent: "Yes, within 1-2 days" };
test("Express always has exactly three screens, including conditional Other on screen 2", () => {
  expect(formScreens(expressPrintingForm, answers).map((s) => s.map((f) => f.id))).toEqual([["name", "whatsapp"], ["needPrinted", "quantity"], ["design", "urgent"]]);
  expect(formScreens(expressPrintingForm, { ...answers, needPrinted: "Other" }).map((s) => s.map((f) => f.id))).toEqual([["name", "whatsapp"], ["needPrinted", "otherPrinted", "quantity"], ["design", "urgent"]]);
});
test("Other requires a specification and stale hidden answers are removed", () => {
  expect(expressAnswersSchema.safeParse({ ...answers, needPrinted: "Other" }).success).toBe(false);
  expect(expressAnswersSchema.parse({ ...answers, needPrinted: "Other", otherPrinted: "Booklets" }).otherPrinted).toBe("Booklets");
  expect(expressAnswersSchema.parse({ ...answers, otherPrinted: "Booklets" }).otherPrinted).toBe("");
});
test("WhatsApp is a digit string preserving leading zeros, never exponential notation", () => {
  expect(expressAnswersSchema.parse(answers).whatsapp).toBe("08030000000");
  expect(expressAnswersSchema.safeParse({ ...answers, whatsapp: "8e10" }).success).toBe(false);
});
test("only the requested dropdown choices are accepted", () => {
  for (const key of ["needPrinted", "design", "urgent"]) expect(expressAnswersSchema.safeParse({ ...answers, [key]: "invalid" }).success).toBe(false);
});