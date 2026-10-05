export const PROJECT_TYPES = ["Web App", "Mobile App", "Website", "Social Media Strategy", "Other"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export function isProjectType(value: unknown): value is ProjectType {
  return typeof value === "string" && PROJECT_TYPES.some((type) => type === value);
}
