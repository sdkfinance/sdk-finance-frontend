import { IPlainObject } from '@/types/interfaces';

export const BUSINESS_TYPES: IPlainObject = {
  eshop: 'entity.business_type.eshop',
  reseller_of_goods: 'entity.business_type.reseller_of_goods',
  service_providers: 'entity.business_type.service_providers',
  mobile_operator: 'entity.business_type.mobile_operator',
  storage_providers: 'entity.business_type.storage_providers',
  high_risk: 'entity.business_type.high_risk',
  other: 'entity.business_type.other',
};

export const BUSINESS_TYPES_ARRAY = Object.keys(BUSINESS_TYPES).map((key) => ({ value: key, label: BUSINESS_TYPES[key] }));
