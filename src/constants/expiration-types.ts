export const EXPIRATION_TYPES = {
  DATE: 'entity.expiration_types.date',
  INFINITY: 'entity.expiration_types.infinity',
  COUNT: 'entity.expiration_types.count',
  AMOUNT: 'entity.expiration_types.amount',
};

export const EXPIRATION_TYPES_ARRAY = Object.keys(EXPIRATION_TYPES).map((key) => (
  // @ts-ignore
  { value: key, label: EXPIRATION_TYPES[key] }
));
