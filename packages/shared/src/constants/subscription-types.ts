export const SUBSCRIPTION_TYPES = {
  DAILY: 'entity.subscription_types.default.daily',
  WEEKLY: 'entity.subscription_types.default.weekly',
  MONTHLY: 'entity.subscription_types.default.monthly',
  ANNUALLY: 'entity.subscription_types.default.annually',
};

export const SUBSCRIPTION_TYPES_ARRAY = Object.keys(SUBSCRIPTION_TYPES).map((key) =>
  // @ts-ignore
  ({ value: key, label: SUBSCRIPTION_TYPES[key] }),
);
