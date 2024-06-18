import config from '@sdk5/shared/config';
import type { TBusinessProcessStatus } from '@sdk5/shared/constants';
import { BUSINESS_PROCESS_STATUS, TRANSACTION_TYPES_ENUM } from '@sdk5/shared/constants';
import type { ITransactionRecordComputed, ITransactionsRecord } from '@sdk5/shared/requests';
import type { IProfileContact } from '@sdk5/shared/types';
import { getFormattedAmount, isUserAreRecipient } from '@sdk5/shared/utils';
import { categoryColors, getDynamicColor } from '@sdk5/ui-kit-front-office';
import { cloneDeep } from 'lodash';

import { getTransactionAmount, getTransactionCurrency } from '../../../utils/transaction-mapping';
import type { TTransactionDirection } from './getTransactionDirection';
import { getTransactionDirection } from './getTransactionDirection';

function getAmountString(options: { amount?: number; currencySymbol?: string; direction?: TTransactionDirection['symbol'] }): string {
  const { currencySymbol, amount, direction } = options;
  return typeof amount !== 'number' ? config.emptyChar : `${direction ?? ''}${currencySymbol ?? ''}${getFormattedAmount(amount)}`;
}

const getColor = getDynamicColor(categoryColors);
export const getTransactionsData = (incomingTransaction: ITransactionsRecord, profileContact: IProfileContact): ITransactionRecordComputed[] => {
  const transaction: ITransactionRecordComputed = cloneDeep(incomingTransaction);

  const { type, destinationCurrency, sourceCurrency, internalSourceAmount, internalDestinationAmount, externalDestinationAmount } = transaction;

  const direction = getTransactionDirection(transaction, profileContact).symbol;
  const isCurrentUserAreRecipient = isUserAreRecipient(transaction, profileContact);

  const transactionCurrencySymbol =
    getTransactionCurrency({
      destinationCurrency,
      sourceCurrency,
      transactionType: type,
      isRecipient: isCurrentUserAreRecipient,
    })?.symbol ?? '';

  transaction.title = transaction.categoryName;
  transaction.color = getColor();
  transaction.transactionIdString = transaction.id;
  transaction.currencySymbol = transactionCurrencySymbol;
  transaction.totalAmountString = getAmountString({
    amount: getTransactionAmount({
      externalDestinationAmount,
      internalDestinationAmount,
      internalSourceAmount,
      isRecipient: isCurrentUserAreRecipient,
      transactionType: type,
    }),
    currencySymbol: transactionCurrencySymbol,
    direction,
  });

  const terminatedStatuses = [
    BUSINESS_PROCESS_STATUS.processed,
    BUSINESS_PROCESS_STATUS.declined,
    BUSINESS_PROCESS_STATUS.rejected,
  ] as TBusinessProcessStatus[];

  if (terminatedStatuses.indexOf(transaction.status) > -1) {
    const { coinDto = [] } = transaction;
    coinDto.forEach((coin) => {
      const {
        amount,
        heldAmount,
        currency: { symbol },
      } = coin;

      const walletAmount = getAmountString({ amount, currencySymbol: symbol });
      const walletHeldAmount = getAmountString({ amount: heldAmount, currencySymbol: symbol });

      transaction.walletAmountString = !transaction.walletAmountString ? walletAmount : `${transaction.walletAmountString} / ${walletAmount}`;
      transaction.walletHeldAmountString = !transaction.walletHeldAmountString
        ? walletHeldAmount
        : `${transaction.walletHeldAmountString} / ${walletHeldAmount}`;
    });
  }

  transaction.commissionString = transaction.commission;

  switch (type) {
    case TRANSACTION_TYPES_ENUM.merchant_payment: {
      const totalAmount = transaction.internalSourceAmount;
      const currencySymbol = transaction.sourceCurrency?.symbol;
      transaction.totalAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
        direction,
      });
      transaction.amountString = getAmountString({
        amount: transaction.amount,
        currencySymbol,
      });
      transaction.feeString = getAmountString({
        amount: transaction.commissionAmount,
        currencySymbol,
      });
      transaction.netAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
      });
      transaction.companyNameString = transaction.posCompanyName;
      transaction.title = transaction.posCompanyName || '';
      transaction.commissionString = 0;
      return [transaction];
    }
    case TRANSACTION_TYPES_ENUM.client_transaction_transfer: {
      const { commissionAmount } = transaction;
      const netAmount = isCurrentUserAreRecipient ? transaction.internalDestinationAmount : transaction.internalSourceAmount;
      const currencySymbol = isCurrentUserAreRecipient ? transaction.destinationCurrency?.symbol : transaction.sourceCurrency?.symbol;
      const commissionAmountString = getAmountString({
        amount: commissionAmount,
        currencySymbol,
      });

      transaction.totalAmountString = getAmountString({
        amount: netAmount,
        currencySymbol,
        direction,
      });

      transaction.amountString = getAmountString({
        amount: transaction.amount,
        currencySymbol,
      });

      transaction.title = isCurrentUserAreRecipient ? transaction?.sender?.fullName : transaction?.recipient?.fullName;

      transaction.senderNameString = isCurrentUserAreRecipient ? transaction.sender?.fullName || '---' : null;
      transaction.recipientNameString = !isCurrentUserAreRecipient ? transaction.recipient?.fullName || '---' : null;

      transaction.netAmountString = getAmountString({
        amount: netAmount,
        currencySymbol,
      });

      transaction.recipientFeeString = isCurrentUserAreRecipient && commissionAmount ? commissionAmountString : null;
      transaction.senderFeeString = !isCurrentUserAreRecipient && commissionAmount ? commissionAmountString : null;

      return [transaction];
    }
    case TRANSACTION_TYPES_ENUM.exchange_transaction: {
      transaction.totalAmountString = getAmountString({
        amount: transaction.internalSourceAmount,
        currencySymbol: transaction.sourceCurrency?.symbol,
        direction: '-',
      });
      transaction.soldAmountString = getAmountString({
        amount: transaction.internalSourceAmount,
        currencySymbol: transaction.sourceCurrency?.code,
      });
      transaction.boughtAmountString = getAmountString({
        amount: transaction.internalDestinationAmount,
        currencySymbol: transaction.destinationCurrency?.code,
      });
      return [transaction];
    }
    case TRANSACTION_TYPES_ENUM.merchant_invoice: {
      const totalAmount = transaction.internalSourceAmount;
      const currencySymbol = transaction.sourceCurrency?.symbol;
      transaction.accountNameString = transaction.clientCoin?.name;
      transaction.accountSerialString = transaction.clientCoin?.serial;
      transaction.recipientAccountSerialString = transaction.merchantCoinSerial;
      transaction.invoiceIdString = transaction.invoiceIdentifier;
      transaction.amountString = getAmountString({
        amount: transaction.amount,
        currencySymbol,
      });
      transaction.feeString = getAmountString({
        amount: transaction.commissionAmount,
        currencySymbol,
      });
      transaction.netAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
      });

      return [transaction];
    }
    case TRANSACTION_TYPES_ENUM.bank_redeem: {
      const currencySymbol = transaction.sourceCurrency?.symbol;
      const totalAmount = transaction.internalSourceAmount;
      transaction.accountNameString = transaction.clientCoin?.name;
      transaction.accountSerialString = transaction.clientCoin?.serial;
      transaction.bankNameString = transaction.bankInfo?.name;
      transaction.bankBicString = transaction.bankInfo?.bic;
      transaction.ibanString = transaction.iban;
      transaction.totalAmountString = getAmountString({
        direction,
        amount: totalAmount,
        currencySymbol,
      });
      transaction.amountString = getAmountString({
        amount: transaction.amount,
        currencySymbol,
      });
      transaction.feeString = getAmountString({
        amount: transaction.commissionAmount,
        currencySymbol,
      });
      transaction.netAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
      });
      return [transaction];
    }
    case TRANSACTION_TYPES_ENUM.bank_topup: {
      const totalAmount = transaction.internalDestinationAmount;
      const currencySymbol = transaction.destinationCurrency?.symbol;
      transaction.totalAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
        direction,
      });
      transaction.amountString = getAmountString({
        amount: transaction.amount,
        currencySymbol,
      });
      transaction.feeString = getAmountString({
        amount: transaction.commissionAmount,
        currencySymbol,
      });
      transaction.netAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
      });
      transaction.bankNameString = transaction.bankInfo?.name;
      transaction.bankBicString = transaction.bankInfo?.bic;
      transaction.ibanString = transaction.iban;
      transaction.accountNameString = transaction.clientCoin?.name;
      transaction.accountSerialString = transaction.clientCoin?.serial;
      return [transaction];
    }
    case TRANSACTION_TYPES_ENUM.gate_charge: {
      const currencySymbol = transaction.destinationCurrency?.symbol;
      const totalAmount = transaction.internalDestinationAmount;
      transaction.accountNameString = transaction.clientCoin?.name;
      transaction.accountSerialString = transaction.clientCoin?.serial;
      transaction.totalAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
        direction,
      });
      transaction.amountString = getAmountString({
        amount: transaction.amount,
        currencySymbol,
      });
      transaction.feeString = getAmountString({
        amount: transaction.commissionAmount,
        currencySymbol,
      });
      transaction.netAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
      });

      return [transaction];
    }
    case TRANSACTION_TYPES_ENUM.gate_redeem: {
      const currencySymbol = transaction.sourceCurrency?.symbol;
      const totalAmount = transaction.internalSourceAmount;
      transaction.totalAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
        direction,
      });
      transaction.amountString = getAmountString({
        amount: transaction.amount,
        currencySymbol,
      });
      transaction.netAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
      });
      transaction.feeString = getAmountString({
        amount: transaction.commissionAmount,
        currencySymbol,
      });
      return [transaction];
    }
    case TRANSACTION_TYPES_ENUM.gate_purchase: {
      const totalAmount = transaction.internalSourceAmount;
      const currencySymbol = transaction.sourceCurrency?.symbol;
      transaction.productIdString = transaction.productId;
      transaction.totalAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
        direction,
      });
      transaction.amountString = getAmountString({
        amount: transaction.amount,
        currencySymbol,
      });
      transaction.feeString = getAmountString({
        amount: transaction.commissionAmount,
        currencySymbol,
      });
      transaction.netAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
      });
      return [transaction];
    }
    case TRANSACTION_TYPES_ENUM.gate_issue_card: {
      const totalAmount = transaction.internalSourceAmount;
      const currencySymbol = transaction.sourceCurrency?.symbol;
      transaction.totalAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
        direction,
      });
      transaction.amountString = getAmountString({
        amount: transaction.amount,
        currencySymbol,
      });
      transaction.feeString = getAmountString({
        amount: transaction.commissionAmount,
        currencySymbol,
      });
      transaction.netAmountString = getAmountString({
        amount: totalAmount,
        currencySymbol,
      });
      return [transaction];
    }
    default:
      return [transaction];
  }
};
