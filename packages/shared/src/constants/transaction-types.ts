export const TRANSACTION_TYPES_ENUM = {
  client_transaction_transfer: 'client_transaction_transfer',
  client_transaction_issue: 'client_transaction_issue',
  client_create_prepaid: 'client_create_prepaid',
  client_charge_prepaid: 'client_charge_prepaid',
  merchant_payment: 'merchant_payment',
  merchant_invoice: 'merchant_invoice',
  gate_charge: 'gate_charge',
  gate_redeem: 'gate_redeem',
  exchange_transaction: 'exchange_transaction',
  bank_topup: 'bank_topup',
  bank_redeem: 'bank_redeem',
  transfer: 'transfer',
  split: 'split',
  merge: 'merge',
  issue: 'issue',
  balance: 'balance',
  redeem: 'redeem',
  commission: 'commission',
  authorization: 'authorization',
  commission_authorization: 'commission_authorization',
  capture: 'capture',
  commission_capture: 'commission_capture',
  reversal: 'reversal',
  commission_reversal: 'commission_reversal',
  hold: 'hold',
  withdraw_exchange_transaction: 'withdraw_exchange_transaction',
  topup_exchange_transaction: 'topup_exchange_transaction',
  cash_desk_charge: 'cash_desk_charge',
  cash_investment: 'cash_investment',
  cash_input: 'cash_input',
  cash_desk_redeem: 'cash_desk_redeem',
  cash_collect: 'cash_collect',
  gate_purchase: 'gate_purchase',
  gate_issue_card: 'gate_issue_card',
  exchange_reserve_top_up: 'exchange_reserve_top_up',
  exchange_reserve_withdraw: 'exchange_reserve_withdraw',
  gate_tokenization: 'gate_tokenization',
} as const;

export const TRANSACTION_TYPES = {
  [TRANSACTION_TYPES_ENUM.transfer]: 'entity.transaction_types.transfer',
  [TRANSACTION_TYPES_ENUM.split]: 'entity.transaction_types.split',
  [TRANSACTION_TYPES_ENUM.merge]: 'entity.transaction_types.merge',
  [TRANSACTION_TYPES_ENUM.issue]: 'entity.transaction_types.issue',
  [TRANSACTION_TYPES_ENUM.balance]: 'entity.transaction_types.balance',
  [TRANSACTION_TYPES_ENUM.redeem]: 'entity.transaction_types.redeem',
  [TRANSACTION_TYPES_ENUM.commission]: 'entity.transaction_types.commission',
  [TRANSACTION_TYPES_ENUM.authorization]: 'entity.transaction_types.authorization',
  [TRANSACTION_TYPES_ENUM.commission_authorization]: 'entity.transaction_types.commission_authorization',
  [TRANSACTION_TYPES_ENUM.capture]: 'entity.transaction_types.capture',
  [TRANSACTION_TYPES_ENUM.commission_capture]: 'entity.transaction_types.commission_capture',
  [TRANSACTION_TYPES_ENUM.reversal]: 'entity.transaction_types.reversal',
  [TRANSACTION_TYPES_ENUM.commission_reversal]: 'entity.transaction_types.commission_reversal',
  [TRANSACTION_TYPES_ENUM.hold]: 'entity.transaction_types.hold',
};

export const INDIVIDUAL_TRANSACTION_TYPES = {
  [TRANSACTION_TYPES_ENUM.client_transaction_transfer]: 'entity.transaction_types.client_transaction_transfer',
  [TRANSACTION_TYPES_ENUM.client_transaction_issue]: 'entity.transaction_types.client_transaction_issue',
  [TRANSACTION_TYPES_ENUM.client_create_prepaid]: 'entity.transaction_types.client_create_prepaid',
  [TRANSACTION_TYPES_ENUM.client_charge_prepaid]: 'entity.transaction_types.client_charge_prepaid',
  [TRANSACTION_TYPES_ENUM.merchant_payment]: 'entity.transaction_types.merchant_payment',
  [TRANSACTION_TYPES_ENUM.merchant_invoice]: 'entity.transaction_types.merchant_invoice',
  [TRANSACTION_TYPES_ENUM.gate_charge]: 'entity.transaction_types.gate_charge',
  [TRANSACTION_TYPES_ENUM.gate_redeem]: 'entity.transaction_types.gate_redeem',
  [TRANSACTION_TYPES_ENUM.exchange_transaction]: 'entity.transaction_types.exchange_transaction',
  [TRANSACTION_TYPES_ENUM.bank_topup]: 'entity.transaction_types.bank_topup',
  [TRANSACTION_TYPES_ENUM.bank_redeem]: 'entity.transaction_types.bank_redeem',
};

export const TRANSACTION_TYPES_ARRAY = Object.keys(TRANSACTION_TYPES).map((key) =>
  // @ts-ignore
  ({ value: key, label: TRANSACTION_TYPES[key] }),
);

export const ALL_TRANSACTION_TYPES_ARRAY = Object.keys(TRANSACTION_TYPES_ENUM).map((key) =>
  // @ts-ignore
  ({ value: key, label: `entity.transaction.type.${key}` }),
);

export type TTransactionType = keyof typeof TRANSACTION_TYPES;
export type TTransactionTypeAll = keyof typeof TRANSACTION_TYPES_ENUM;
