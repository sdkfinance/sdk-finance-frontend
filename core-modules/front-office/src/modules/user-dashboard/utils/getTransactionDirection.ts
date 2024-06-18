import { TRANSACTION_TYPES_ENUM } from '@sdk5/shared/constants';
import type { ITransactionsRecord } from '@sdk5/shared/requests';
import type { IProfileContact } from '@sdk5/shared/types';
import { isUserAreRecipient } from '@sdk5/shared/utils';

export type TTransactionDirection = {
  type: 'IN' | 'OUT';
  symbol: '-' | '+';
};

const outTypes = [
  TRANSACTION_TYPES_ENUM.client_create_prepaid,
  TRANSACTION_TYPES_ENUM.merchant_payment,
  TRANSACTION_TYPES_ENUM.merchant_invoice,
  TRANSACTION_TYPES_ENUM.gate_redeem,
  TRANSACTION_TYPES_ENUM.bank_redeem,
  TRANSACTION_TYPES_ENUM.withdraw_exchange_transaction,
  TRANSACTION_TYPES_ENUM.gate_issue_card,
  TRANSACTION_TYPES_ENUM.gate_purchase,
  TRANSACTION_TYPES_ENUM.cash_desk_redeem,
];

const inTypes = [
  TRANSACTION_TYPES_ENUM.client_transaction_issue,
  TRANSACTION_TYPES_ENUM.client_charge_prepaid,
  TRANSACTION_TYPES_ENUM.gate_charge,
  TRANSACTION_TYPES_ENUM.bank_topup,
  TRANSACTION_TYPES_ENUM.topup_exchange_transaction,
];

export const getTransactionDirection = (transaction: ITransactionsRecord, userContact: IProfileContact): TTransactionDirection => {
  const { type } = transaction;

  if (inTypes.includes(type)) {
    return {
      type: 'IN',
      symbol: '+',
    };
  }

  if (outTypes.includes(type)) {
    return {
      type: 'OUT',
      symbol: '-',
    };
  }

  if (type === TRANSACTION_TYPES_ENUM.client_transaction_transfer) {
    const isUserRecipient = isUserAreRecipient(transaction, userContact);

    return {
      type: isUserRecipient ? 'IN' : 'OUT',
      symbol: isUserRecipient ? '+' : '-',
    };
  }

  return {
    type: 'IN',
    symbol: '+',
  };
};
