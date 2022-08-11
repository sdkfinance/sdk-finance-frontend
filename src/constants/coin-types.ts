export const COIN_TYPES = {
  regular_commission: 'entity.coin_types.regular_commission',
  business_commission: 'entity.coin_types.business_commission',
  regular_gate_commission: 'entity.coin_types.regular_gate_commission',
  business_gate_commission: 'entity.coin_types.business_gate_commission',
  gate: 'entity.coin_types.gate',
  reserve: 'entity.coin_types.reserve',
  prepaid: 'entity.coin_types.prepaid',
  credit: 'entity.coin_types.credit',
  deposit: 'entity.coin_types.deposit',
  deposit_accrued: 'entity.coin_types.deposit_accrued',
  client: 'entity.coin_types.client',
  cash: 'entity.coin_types.cash',
  cashback_merchant: 'entity.coin_types.cashback_merchant',
  cashback_payer: 'entity.coin_types.cashback_payer',
  debt: 'entity.coin_types.debt',
  merchant_operational: 'entity.coin_types.merchant_operational',
  merchant_reserve: 'entity.coin_types.merchant_reserve',
  vat: 'entity.coin_types.vat',
  system_vat: 'entity.coin_types.system_vat',
  provider_vat: 'entity.coin_types.provider_vat',
  internal_client: 'entity.coin_types.internal_client',
  merchant_reserve_debt: 'entity.coin_types.merchant_reserve_debt',
  payment_in_advance: 'entity.coin_types.payment_in_advance',
  charge_back: 'entity.coin_types.charge_back',
};

export const COIN_TYPES_ARRAY = Object.keys(COIN_TYPES).map((key) => (
  // @ts-ignore
  { value: key, label: COIN_TYPES[key] }
));
