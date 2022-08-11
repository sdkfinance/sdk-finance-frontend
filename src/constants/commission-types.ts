export const COMMISSION_TYPES = {
  zero: 'entity.commission_types.zero',
  percent: 'entity.commission_types.percent',
  fixed: 'entity.commission_types.fixed',
  greater_of_fixed_or_percent: 'entity.commission_types.greater_of_fixed_or_percent',
  lesser_of_fixed_or_percent: 'entity.commission_types.lesser_of_fixed_or_percent',
  fixed_and_percent: 'entity.commission_types.fixed_and_percent',
};

export const COMMISSION_TYPES_ARRAY = Object.keys(COMMISSION_TYPES).map((key) => (
  // @ts-ignore
  { value: key, label: COMMISSION_TYPES[key] }
));
