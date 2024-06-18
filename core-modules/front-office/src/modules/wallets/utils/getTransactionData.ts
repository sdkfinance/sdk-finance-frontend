import config from '@sdk5/shared/config';
import { TRANSACTION_TYPES_ENUM } from '@sdk5/shared/constants';
import type { ITransactionsRecord, IWalletRecord } from '@sdk5/shared/requests';
import type { IPlainObject, IProfileContact } from '@sdk5/shared/types';
import { isUserAreRecipient } from '@sdk5/shared/utils';

import { getTransactionAmount, getTransactionCurrency } from '../../../utils/transaction-mapping';

export function checkIsUserAreRecipient(options: {
  transaction: ITransactionsRecord;
  profileData?: IProfileContact;
  userCoins: IWalletRecord[];
}): boolean {
  const { transaction, userCoins, profileData } = options;

  const { transactions, to } = transaction;
  const transactionRecipientSerial = transactions?.at(0)?.to?.serial ?? to?.serial;
  const isRecipientSerialExistInUserCoins = userCoins.findIndex(({ serial }) => serial === transactionRecipientSerial) !== -1;
  const isUserAreRecipientByContactData = isUserAreRecipient(transaction, profileData);

  return isUserAreRecipientByContactData || isRecipientSerialExistInUserCoins;
}

export function getExchangeAmountData(transaction: ITransactionsRecord): IPlainObject {
  const { type, internalSourceAmount, internalDestinationAmount, sourceCurrency, destinationCurrency } = transaction;

  return {
    type,
    amountFrom: internalSourceAmount,
    amountTo: internalDestinationAmount,
    toCurrency: destinationCurrency?.sn,
    fromCurrency: sourceCurrency?.sn,
  };
}

export function getTransactionData(options: {
  transaction: ITransactionsRecord;
  coinsData: IWalletRecord[];
  profileContactData?: IProfileContact;
}): IPlainObject {
  const { coinsData, transaction, profileContactData } = options;

  if (transaction.type === TRANSACTION_TYPES_ENUM.exchange_transaction) {
    return getExchangeAmountData(transaction);
  }

  const isRecipient = checkIsUserAreRecipient({ userCoins: coinsData, profileData: profileContactData, transaction });

  const { type, cashAmount, sourceCurrency, destinationCurrency, internalSourceAmount, internalDestinationAmount, externalDestinationAmount } =
    transaction || {};

  const transactionAmount = getTransactionAmount({
    internalDestinationAmount,
    externalDestinationAmount,
    internalSourceAmount,
    isRecipient,
    transactionType: type,
  });
  const transactionCurrency =
    getTransactionCurrency({
      destinationCurrency,
      sourceCurrency,
      isRecipient,
      transactionType: type,
    })?.sn ?? '';
  const displayAmount = transactionAmount ?? cashAmount ?? config.emptyChar;
  const directionSymbol = isRecipient ? '+' : '-';

  return {
    type,
    directionSymbol,
    fromCurrency: transactionCurrency,
    amount: displayAmount,
  };
}
