import { TRANSACTION_TYPES_ENUM } from './transaction-types';

export const INDIVIDUAL_ROLE_NO_SENDER_OPERATIONS = [
  TRANSACTION_TYPES_ENUM.gate_charge,
  TRANSACTION_TYPES_ENUM.bank_topup,
  TRANSACTION_TYPES_ENUM.client_charge_prepaid,
  TRANSACTION_TYPES_ENUM.cash_desk_charge,
  TRANSACTION_TYPES_ENUM.cash_input,
  TRANSACTION_TYPES_ENUM.cash_investment,
];
export const INDIVIDUAL_ROLE_NO_RECIPIENT_OPERATIONS = [
  TRANSACTION_TYPES_ENUM.gate_redeem,
  TRANSACTION_TYPES_ENUM.bank_redeem,
  TRANSACTION_TYPES_ENUM.cash_desk_redeem,
  TRANSACTION_TYPES_ENUM.cash_collect,
];
export const INDIVIDUAL_ROLE_EXTERNAL_DESTINATION_OPERATIONS = [TRANSACTION_TYPES_ENUM.gate_purchase];

export const SYSTEM_ROLES_EXTERNAL_DESTINATION_AMOUNT_OPERATIONS = [
  TRANSACTION_TYPES_ENUM.gate_redeem,
  TRANSACTION_TYPES_ENUM.bank_redeem,
  TRANSACTION_TYPES_ENUM.gate_purchase,
  TRANSACTION_TYPES_ENUM.cash_desk_redeem,
  TRANSACTION_TYPES_ENUM.cash_collect,
  TRANSACTION_TYPES_ENUM.gate_issue_card,
  TRANSACTION_TYPES_ENUM.exchange_reserve_withdraw,
];
export const SYSTEM_ROLES_EXTERNAL_SOURCE_AMOUNT_OPERATIONS = [
  TRANSACTION_TYPES_ENUM.gate_charge,
  TRANSACTION_TYPES_ENUM.bank_topup,
  TRANSACTION_TYPES_ENUM.cash_desk_charge,
  TRANSACTION_TYPES_ENUM.cash_investment,
  TRANSACTION_TYPES_ENUM.cash_input,
  TRANSACTION_TYPES_ENUM.exchange_reserve_top_up,
];
