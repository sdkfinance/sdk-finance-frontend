export const QUALIFIER = {
  amount: 'entity.qualifier.amount',
  quantity: 'entity.qualifier.quantity',
};

export const QUALIFIER_ARRAY = Object.keys(QUALIFIER).map((key) => (
  // @ts-ignore
  { value: key, label: QUALIFIER[key] }
));
