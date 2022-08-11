export const TIME_UNITS = {
  per_transaction: 'entity.time_unit.per_transaction',
  per_day: 'entity.time_unit.per_day',
  per_week: 'entity.time_unit.per_week',
  per_month: 'entity.time_unit.per_month',
  per_quarter: 'entity.time_unit.per_quarter',
  per_year: 'entity.time_unit.per_year',
  per_life: 'entity.time_unit.per_life',
};

export const TIME_UNITS_ARRAY = Object.keys(TIME_UNITS).map((key) => (
  // @ts-ignore
  { value: key, label: TIME_UNITS[key] }
));
