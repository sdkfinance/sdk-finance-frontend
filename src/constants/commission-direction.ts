export const COMMISSION_DIRECTION = {
  IN: 'entity.commission_direction.IN',
  OUT: 'entity.commission_direction.OUT',
};

export const COMMISSION_DIRECTION_ARRAY = Object.keys(COMMISSION_DIRECTION).map((key) => (
  // @ts-ignore
  { value: key, label: COMMISSION_DIRECTION[key] }
));
