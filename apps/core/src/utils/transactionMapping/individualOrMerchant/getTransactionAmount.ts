import {
  INDIVIDUAL_ROLE_EXTERNAL_DESTINATION_OPERATIONS,
  INDIVIDUAL_ROLE_NO_RECIPIENT_OPERATIONS,
  INDIVIDUAL_ROLE_NO_SENDER_OPERATIONS,
} from '@sdk5/shared/constants';
import type { ITransactionsRecord } from '@sdk5/shared/requests';

export function getTransactionAmount(options: {
  transactionType: ITransactionsRecord['type'];
  internalDestinationAmount: ITransactionsRecord['internalDestinationAmount'];
  internalSourceAmount: ITransactionsRecord['internalSourceAmount'];
  externalDestinationAmount: ITransactionsRecord['externalDestinationAmount'];
  isRecipient: boolean;
}): number | undefined {
  const { transactionType, internalDestinationAmount, internalSourceAmount, externalDestinationAmount, isRecipient } = options;

  if (INDIVIDUAL_ROLE_EXTERNAL_DESTINATION_OPERATIONS.indexOf(transactionType) !== -1 && isRecipient) {
    return externalDestinationAmount;
  }

  if (INDIVIDUAL_ROLE_NO_RECIPIENT_OPERATIONS.indexOf(transactionType) !== -1) {
    return internalSourceAmount;
  }

  if (INDIVIDUAL_ROLE_NO_SENDER_OPERATIONS.indexOf(transactionType) !== -1) {
    return internalDestinationAmount;
  }

  return isRecipient ? internalDestinationAmount : internalSourceAmount;
}
