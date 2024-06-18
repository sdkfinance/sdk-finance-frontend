import {
  SYSTEM_ROLES_EXTERNAL_DESTINATION_AMOUNT_OPERATIONS,
  SYSTEM_ROLES_EXTERNAL_SOURCE_AMOUNT_OPERATIONS,
  TRANSACTION_TYPES_ENUM,
} from '@sdk5/shared/constants';
import type { ICurrencyShort, ITransactionRecordComputed, ITransactionsRecord } from '@sdk5/shared/requests';
import { cloneDeep } from 'lodash';

type TTransactionDataTuple<T> = [T | undefined, T | undefined];

function getAmountDisplayString(amount?: number, currencyCode?: string) {
  return typeof amount !== 'undefined' && typeof currencyCode === 'string' ? `${amount} ${currencyCode}` : undefined;
}

function getTransactionCurrencyData(transaction: ITransactionsRecord): TTransactionDataTuple<ICurrencyShort> {
  const { sourceCurrency, destinationCurrency } = transaction;
  return [sourceCurrency, destinationCurrency];
}

function getTransactionCommissionDataDetails(
  transaction: ITransactionsRecord,
  currencies: {
    sourceCurrency?: ICurrencyShort;
    destinationCurrency?: ICurrencyShort;
  },
) {
  const { destinationCurrency, sourceCurrency } = currencies;
  const { commissionAmounts, type: transactionType, commissionAmount } = transaction;
  const source = commissionAmounts?.source;
  const destination = commissionAmounts?.destination;

  let senderFee: number | string | undefined;
  let recipientFee: number | string | undefined;
  let systemFee: number | string | undefined;
  let providerFee: number | string | undefined;
  let totalFee: number | string | undefined;

  switch (transactionType) {
    case TRANSACTION_TYPES_ENUM.client_transaction_transfer:
      senderFee = getAmountDisplayString(source?.total, sourceCurrency?.code);
      recipientFee = getAmountDisplayString(destination?.total, destinationCurrency?.code);
      break;
    case TRANSACTION_TYPES_ENUM.exchange_transaction:
      systemFee = getAmountDisplayString(source?.system, sourceCurrency?.code);
      break;
    case TRANSACTION_TYPES_ENUM.gate_redeem:
      providerFee = getAmountDisplayString(source?.provider, sourceCurrency?.code);
      systemFee = getAmountDisplayString(source?.system, sourceCurrency?.code);
      totalFee = getAmountDisplayString(source?.total, sourceCurrency?.code);
      break;
    case TRANSACTION_TYPES_ENUM.gate_charge:
      providerFee = getAmountDisplayString(source?.provider, destinationCurrency?.code);
      systemFee = getAmountDisplayString(destination?.system, destinationCurrency?.code);
      totalFee = getAmountDisplayString(destination?.total, destinationCurrency?.code);
      break;
    case TRANSACTION_TYPES_ENUM.bank_topup:
      systemFee = getAmountDisplayString(destination?.system, destinationCurrency?.code);
      break;
    case TRANSACTION_TYPES_ENUM.bank_redeem:
    case TRANSACTION_TYPES_ENUM.merchant_payment:
    case TRANSACTION_TYPES_ENUM.merchant_invoice:
      systemFee = getAmountDisplayString(source?.system, sourceCurrency?.code);
      break;
    case TRANSACTION_TYPES_ENUM.gate_purchase:
    case TRANSACTION_TYPES_ENUM.gate_issue_card:
      providerFee = getAmountDisplayString(destination?.provider, destinationCurrency?.code);
      systemFee = getAmountDisplayString(source?.system, sourceCurrency?.code);
      totalFee = getAmountDisplayString(commissionAmount, sourceCurrency?.code);
      break;
    case TRANSACTION_TYPES_ENUM.cash_desk_charge:
      systemFee = getAmountDisplayString(destination?.system, destinationCurrency?.code);
      break;
    case TRANSACTION_TYPES_ENUM.cash_desk_redeem:
    case TRANSACTION_TYPES_ENUM.client_create_prepaid:
    case TRANSACTION_TYPES_ENUM.client_charge_prepaid:
      systemFee = getAmountDisplayString(source?.system, sourceCurrency?.code);
      break;
    default:
      break;
  }
  return {
    senderFee,
    recipientFee,
    systemFee,
    providerFee,
    totalFee,
  };
}

function getTransactionAmountData(transaction: ITransactionRecordComputed): TTransactionDataTuple<number> {
  const { type: transactionType, internalDestinationAmount, internalSourceAmount, externalDestinationAmount, externalSourceAmount } = transaction;

  let source = internalSourceAmount;
  let destination = internalDestinationAmount;

  if (SYSTEM_ROLES_EXTERNAL_SOURCE_AMOUNT_OPERATIONS.indexOf(transactionType) !== -1) {
    source = externalSourceAmount;
  }

  if (SYSTEM_ROLES_EXTERNAL_DESTINATION_AMOUNT_OPERATIONS.indexOf(transactionType) !== -1) {
    destination = externalDestinationAmount;
  }

  return [source, destination];
}

export function getComputedTransactionDataForSystemRoles(rawTransaction: ITransactionsRecord): ITransactionRecordComputed {
  const transaction = cloneDeep(rawTransaction) as ITransactionRecordComputed;
  const [sourceCurrency, destinationCurrency] = getTransactionCurrencyData(transaction);
  const { providerFee, recipientFee, senderFee, systemFee, totalFee } = getTransactionCommissionDataDetails(transaction, {
    destinationCurrency,
    sourceCurrency,
  });
  const [sourceAmount, destinationAmount] = getTransactionAmountData(transaction);

  transaction.amountDestinationCurrencySymbol = destinationCurrency?.symbol;
  transaction.amountSourceCurrencySymbol = sourceCurrency?.symbol;
  transaction.amountSource = sourceAmount;
  transaction.amountDestination = destinationAmount;
  transaction.commissionSender = transaction.commissionAmounts?.source?.total;
  transaction.commissionRecipient = transaction.commissionAmounts?.destination?.total;

  transaction.balanceDetails = {};
  transaction.balanceDetails.amountSource = getAmountDisplayString(sourceAmount, sourceCurrency?.code);
  transaction.balanceDetails.amountDestination = getAmountDisplayString(destinationAmount, destinationCurrency?.code);
  transaction.balanceDetails.providerCommission = providerFee;
  transaction.balanceDetails.systemCommission = systemFee;
  transaction.balanceDetails.totalCommission = totalFee;
  transaction.balanceDetails.commissionSender = senderFee;
  transaction.balanceDetails.commissionDestination = recipientFee;

  return transaction;
}
