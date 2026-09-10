export const validateForm = (rules: { condition: boolean; message: string }[]) =>
  rules.find((r) => r.condition)?.message || null;

export const Validators = {
  isEmpty: (value: any) => !value || (typeof value === "string" && !value.trim()),
  isTooShort: (value: string, minLength: number) => !value || (typeof value === "string" && value.trim().length < minLength),
  isInvalidPhone: (value: string) => !value?.match(/\d/),
  isInvalidEmail: (value: string) => !value?.includes("@"),
};

