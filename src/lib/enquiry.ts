import { isProjectType, type ProjectType } from "@/lib/project-types";

export const ENQUIRY_LIMITS = { name: 120, email: 254, company: 160, message: 6000 } as const;

export type Enquiry = {
  name: string;
  email: string;
  company: string;
  projectType: ProjectType;
  message: string;
};

// A single mailbox only: never accept a header, display name or recipient list.
export function isEmail(value: string) {
  return value.length <= ENQUIRY_LIMITS.email && !value.includes("\0") && /^[^\s@<>(),;:\\"\[\]]+@[^\s@<>(),;:\\"\[\]]+\.[^\s@<>(),;:\\"\[\]]+$/.test(value);
}

export function parseEnquiry(value: unknown): Enquiry | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  const fields: Record<string, string> = {};
  for (const [key, limit] of Object.entries(ENQUIRY_LIMITS)) {
    if (typeof data[key] !== "string" || data[key].length > limit) return null;
    fields[key] = data[key].trim();
    if (key !== "message" && /[\r\n\u0000]/.test(fields[key])) return null;
  }
  if (!fields.name || !isEmail(fields.email) || !fields.message || /\u0000/.test(fields.message) || !isProjectType(data.projectType)) return null;
  return { name: fields.name, email: fields.email, company: fields.company, message: fields.message, projectType: data.projectType };
}
