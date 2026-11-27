export type FieldType = "text" | "tel" | "number" | "select" | "radio" | "checkbox" | "textarea";

export interface FormField {
  id: string;
  label: string;
  help?: string;
  type: FieldType;
  options?: string[];
  allowOther?: boolean;
  optional?: boolean;
  placeholder?: string;
  /** Only show this field when the given field's answer starts with "Yes". */
  showIfYes?: string;
  showIfEquals?: { field: string; value: string };
  screen?: number;
}

export interface FormConfig {
  slug: "printing" | "packaging" | "express-printing";
  tab: string;
  title: string;
  kicker: string;
  blurb: string;
  fields: FormField[];
}

const contactFields: FormField[] = [
  { id: "name", label: "What's your name?", type: "text", placeholder: "Full name" },
  {
    id: "whatsapp",
    label: "Your WhatsApp number",
    help: "This is how a specialist will reach you.",
    type: "tel",
    placeholder: "e.g. 0803 000 0000",
  },
  {
    id: "business",
    label: "Business / organization name",
    type: "text",
    placeholder: "e.g. Puregold Foods",
  },
];

export const printingForm: FormConfig = {
  slug: "printing",
  tab: "Printing",
  title: "General Printing",
  kicker: "Print enquiry",
  blurb:
    "Business cards, flyers, banners, stickers, event materials — tell us what you need printed and a specialist will come back to you.",
  fields: [
    ...contactFields,
    {
      id: "needPrinted",
      label: "What do you need printed?",
      help: "Select all that apply.",
      type: "checkbox",
      options: [
        "Business cards & branding kits",
        "Flyers / posters",
        "Banners / pull-up banners / event signage",
        "Stickers / labels",
        "Event materials (programs, booklets, tags)",
      ],
      allowOther: true,
    },
    {
      id: "when",
      label: "When do you need this?",
      type: "radio",
      options: ["Within 2 weeks", "Within 1 month", "Within 3 months", "Just researching / not sure"],
    },
    {
      id: "printedBefore",
      label: "Have you printed something similar before?",
      type: "radio",
      options: ["Yes, multiple times", "Yes, once or twice", "No, this is my first time"],
    },
    {
      id: "purpose",
      label: "What's the main purpose of this print job?",
      type: "radio",
      options: [
        "Promote my business / services",
        "Promote an event (church, school, conference, etc.)",
        "Brand my office / shop",
        "Product labeling / packaging",
      ],
      allowOther: true,
    },
    {
      id: "budget",
      label: "Rough budget range?",
      type: "radio",
      optional: true,
      options: ["Under ₦50,000", "₦50,000–₦150,000", "₦150,000–₦500,000", "Above ₦500,000"],
    },
    {
      id: "knowSpecs",
      label: "Do you already know the specs you want?",
      type: "radio",
      optional: true,
      options: [
        "Yes, I know size/material/quantity (I want to request a quote/order)",
        "No, I want recommendations based on my project",
      ],
    },
    {
      id: "specs",
      label: "Please share your key specs",
      help: "Size, material, quantity, finishing — anything useful.",
      type: "textarea",
      optional: true,
      showIfYes: "knowSpecs",
    },
  ],
};

export const packagingForm: FormConfig = {
  slug: "packaging",
  tab: "Packaging",
  title: "Food Packaging",
  kicker: "Packaging enquiry",
  blurb:
    "Pouches, jars, labels and printed packaging for food brands. Answer a few questions and we'll recommend the right fit.",
  fields: [
    ...contactFields,
    {
      id: "selling",
      label: "Are you currently selling your food product?",
      type: "radio",
      options: [
        "Yes, consistently (multiple sales per week/month)",
        "Yes, but just started (a few sales so far)",
        "No, still planning",
      ],
    },
    {
      id: "units",
      label: "Roughly how many units do you produce per month?",
      type: "radio",
      options: ["Less than 100", "100–300", "300–1,000", "1,000+"],
    },
    {
      id: "currentPackaging",
      label: "What best describes your current packaging?",
      type: "radio",
      options: [
        "Plain nylon/pouches with paper stickers",
        "Generic pouches/jars with simple labels",
        "Already using printed packaging, but want to upgrade",
      ],
      allowOther: true,
    },
    {
      id: "goal",
      label: "What's your main packaging goal right now?",
      help: "Select one.",
      type: "radio",
      options: [
        "Get more new customers to try my product",
        "Get more repeat orders from existing customers",
        "Look more professional / charge higher prices",
        "Get into more shops or distribution",
      ],
      allowOther: true,
    },
    {
      id: "timeline",
      label: "When are you planning your next packaging order?",
      type: "radio",
      options: ["Within 2 weeks", "Within 1 month", "Within 3 months", "Just researching / not sure"],
    },
    {
      id: "knowWhat",
      label: "Do you already know what packaging you want?",
      type: "radio",
      options: [
        "Yes, I know what I need (I want to request a quote/order)",
        "No, I want recommendations based on my goals",
      ],
    },
    {
      id: "packagingType",
      label: "Type of packaging",
      type: "text",
      optional: true,
      placeholder: "e.g. stand-up pouches",
      showIfYes: "knowWhat",
    },
    {
      id: "quantity",
      label: "Approximate quantity",
      type: "text",
      optional: true,
      placeholder: "e.g. 1,000",
      showIfYes: "knowWhat",
    },
    {
      id: "preferences",
      label: "Any specific material/size preferences?",
      type: "text",
      optional: true,
      placeholder: "Optional",
      showIfYes: "knowWhat",
    },
  ],
};

export const CUSTOM_QUANTITY = "Custom quantity";

export const expressPrintingForm: FormConfig = {
  slug: "express-printing",
  tab: "Express",
  title: "Express Printing Jobs",
  kicker: "Express print enquiry",
  blurb: "",
  fields: [
    { id: "name", label: "Full Name", type: "text", placeholder: "Full name", screen: 1 },
    { id: "whatsapp", label: "WhatsApp Number", type: "number", placeholder: "e.g. 0803 000 0000", screen: 1 },
    { id: "needPrinted", label: "What do you need printed?", type: "select", options: ["Stickers", "Business Cards", "Flyers/Posters", "Banners", "Branded Shirts", "Other"], screen: 2 },
    { id: "otherPrinted", label: "Please specify what you need", type: "text", showIfEquals: { field: "needPrinted", value: "Other" }, screen: 2 },
    { id: "quantityChoice", label: "What quantity do you need?", type: "select", screen: 2 },
    {
      id: "quantity",
      label: "Enter your quantity",
      type: "text",
      placeholder: "e.g. 250",
      showIfEquals: { field: "quantityChoice", value: CUSTOM_QUANTITY },
      screen: 2,
    },
    { id: "design", label: "Do you already have your design file?", type: "select", options: ["Yes, I have it ready", "No, I need quick design help"], screen: 3 },
    { id: "urgent", label: "Do you need this urgently?", type: "select", options: ["Yes, within 1-2 days", "No, I can wait a few days"], screen: 3 },
  ],
};

export const expressQuantityChoices: Record<string, string[]> = {
  Stickers: ["50", "100", "250", "500", "1,000", CUSTOM_QUANTITY],
  "Business Cards": ["100", "250", "500", "1,000", "2,000", CUSTOM_QUANTITY],
  "Flyers/Posters": ["100", "250", "500", "1,000", CUSTOM_QUANTITY],
  Banners: ["1", "2", "5", "10", "25", CUSTOM_QUANTITY],
  "Branded Shirts": ["5", "10", "25", "50", CUSTOM_QUANTITY],
  Other: [CUSTOM_QUANTITY],
};

export function optionsFor(config: FormConfig, field: FormField, answers: Record<string, string>): string[] {
  if (config.slug === "express-printing" && field.id === "quantityChoice") {
    return expressQuantityChoices[answers["needPrinted"] ?? ""] ?? [CUSTOM_QUANTITY];
  }
  return field.options ?? [];
}

export const forms = { printing: printingForm, packaging: packagingForm, "express-printing": expressPrintingForm } as const;

export function visibleFields(config: FormConfig, answers: Record<string, string>) {
  return config.fields.filter((f) => {
    if (f.showIfEquals) return answers[f.showIfEquals.field] === f.showIfEquals.value;
    if (!f.showIfYes) return true;
    return (answers[f.showIfYes] ?? "").startsWith("Yes");
  });
}

export function formScreens(config: FormConfig, answers: Record<string, string>) {
  const fields = visibleFields(config, answers);
  if (config.slug !== "express-printing") return chunkFields(fields);
  return [1, 2, 3].map((screen) => fields.filter((f) => f.screen === screen));
}

export function chunkFields(fields: FormField[], size = 2) {
  const out: FormField[][] = [];
  for (let i = 0; i < fields.length; i += size) out.push(fields.slice(i, i + size));
  return out;
}
