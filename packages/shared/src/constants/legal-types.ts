export const LEGAL_TYPES = {
  individual: 'individual',
  corporation: 'corporation',
} as const;
export type TLegalType = (typeof LEGAL_TYPES)[keyof typeof LEGAL_TYPES];

export const LEGAL_TYPES_ARRAY = Object.keys(LEGAL_TYPES).map((key) => ({
  value: key,
  label: `entity.legal.${LEGAL_TYPES[key as keyof typeof LEGAL_TYPES]}`,
}));
