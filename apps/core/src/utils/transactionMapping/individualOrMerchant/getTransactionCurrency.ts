import { INDIVIDUAL_ROLE_NO_RECIPIENT_OPERATIONS, INDIVIDUAL_ROLE_NO_SENDER_OPERATIONS } from '@sdk5/shared/constants';
import type { ICurrencyShort, ITransactionsRecord } from '@sdk5/shared/requests';

export function getTransactionCurrency(options: {
  transactionType: ITransactionsRecord['type'];
  sourceCurrency?: ITransactionsRecord['sourceCurrency'];
  destinationCurrency?: ITransactionsRecord['destinationCurrency'];
  isRecipient: boolean;
}): ICurrencyShort | undefined {
  const { sourceCurrency, destinationCurrency, transactionType, isRecipient } = options;

  if (INDIVIDUAL_ROLE_NO_RECIPIENT_OPERATIONS.indexOf(transactionType) !== -1) {
    return sourceCurrency;
  }

  if (INDIVIDUAL_ROLE_NO_SENDER_OPERATIONS.indexOf(transactionType) !== -1) {
    return destinationCurrency;
  }

  return isRecipient ? destinationCurrency : sourceCurrency;
}
