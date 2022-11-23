import { categoryColors, getDynamicColor } from '@/components/ui-kit/colors';
import { TRANSACTION_TYPES_ENUM } from '@/constants';
import { translate } from '@/i18n';
import { ITransactionRecordComputed } from '@/services/requests/transactions/Transactions.types';
import { IProfileContact } from '@/types/interfaces/Profile.interface';
import { getFormattedAmount, getTransactionDirection, isUserAreRecipient } from '@/utils';

const getColor = getDynamicColor(categoryColors);
export const getTransactionsData = (transaction: ITransactionRecordComputed, profileContact: IProfileContact): ITransactionRecordComputed[] => {
  const direction: string = getTransactionDirection(transaction, profileContact).symbol;
  const { type } = transaction;
  const isCurrentUserAreRecipient = isUserAreRecipient(transaction, profileContact);

  transaction.title = transaction.categoryName;
  transaction.color = getColor();
  transaction.transactionIdString = transaction.id;
  transaction.currencySymbol = transaction.transactions?.[0]?.from?.issuer.symbol || transaction?.from?.issuer?.symbol || '';
  transaction.amountString = `${direction}${transaction.currencySymbol}${getFormattedAmount(transaction.amount)}`;
  transaction.commissionString = transaction.commission;
  transaction.categoryString = transaction.categoryName;

  switch (type) {
    case TRANSACTION_TYPES_ENUM.merchant_payment:
      transaction.title = transaction.posCompanyName || '';
      transaction.amountString = `${direction}${transaction.currencySymbol}${getFormattedAmount(transaction.invoiceAmount)}`;
      transaction.amountDetailsString = transaction.invoiceAmount;
      transaction.commissionString = 0;
      return [transaction];

    case TRANSACTION_TYPES_ENUM.client_transaction_transfer:
      transaction.title = isCurrentUserAreRecipient
        ? transaction?.sender?.fullName
        : transaction?.recipient?.fullName;
      transaction.detailsTitle = translate('pages.transactions.transfer') as string;
      transaction.amountString = `${direction}${transaction.currencySymbol}${getFormattedAmount(transaction.amount)}`;
      transaction.senderNameString = isCurrentUserAreRecipient ? transaction.sender?.fullName || '---' : null;
      transaction.recipientNameString = !isCurrentUserAreRecipient ? transaction.recipient?.fullName || '---' : null;
      transaction.grossAmountString = isCurrentUserAreRecipient
        ? transaction.operationAmountDetails?.recipientGrossAmount
        : transaction.operationAmountDetails?.senderGrossAmount;
      transaction.netAmountString = isCurrentUserAreRecipient
        ? transaction.operationAmountDetails?.recipientGrossAmount
        : transaction.operationAmountDetails?.senderNetAmount;
      transaction.recipientFeeString = isCurrentUserAreRecipient
        ? transaction.operationAmountDetails?.recipientFee
        : null;
      transaction.senderFeeString = !isCurrentUserAreRecipient
        ? transaction.operationAmountDetails?.senderFee
        : null;

      return [transaction];

    case TRANSACTION_TYPES_ENUM.exchange_transaction:
      return transaction.children.map((child: ITransactionRecordComputed) => {
        child.title = child.type === TRANSACTION_TYPES_ENUM.withdraw_exchange_transaction
          ? translate('pages.transactions.sold_currency') as string
          : translate('pages.transactions.bought_currency') as string;
        child.amountString = child.type === TRANSACTION_TYPES_ENUM.withdraw_exchange_transaction
          ? `-${child.coin.issuer.symbol}${getFormattedAmount(child.outgoingAmount)}`
          : `+${child.coin.issuer.symbol}${getFormattedAmount(child.incomingAmount)}`;
        child.detailsTitle = child.title;
        child.categoryString = child.categoryName;
        child.transactionIdString = child.id;
        child.soldAmountString = child.type === TRANSACTION_TYPES_ENUM.withdraw_exchange_transaction
          ? `${child.coin?.issuer?.symbol}${child.outgoingAmount}`
          : null;
        child.boughtAmountString = child.type === TRANSACTION_TYPES_ENUM.topup_exchange_transaction
          ? `${child.coin?.issuer?.symbol}${child.incomingAmount}`
          : null;

        return child;
      });

    case TRANSACTION_TYPES_ENUM.merchant_invoice:
      transaction.amountString = `${direction}${transaction.currencySymbol}${getFormattedAmount(transaction.invoiceAmount)}`;
      transaction.amountDetailsString = transaction.invoiceAmount;
      transaction.accountNameString = transaction.transactions?.[0]?.from.name;
      transaction.accountSerialString = transaction.transactions?.[0]?.from.serial;
      transaction.recipientAccountSerialString = transaction.merchantCoinSerial;
      transaction.invoiceIdString = transaction.invoiceIdentifier;
      transaction.transactionIdString = null;

      return [transaction];

    case TRANSACTION_TYPES_ENUM.gate_charge:
      transaction.currencySymbol = transaction.clientCoin?.issuer.symbol || '';
      transaction.amountString = `${direction}${transaction.currencySymbol}${getFormattedAmount(transaction.netAmount)}`;
      transaction.amountDetailsString = transaction.amount;
      transaction.netAmountString = transaction.netAmount;
      transaction.accountNameString = transaction.clientCoin?.name;
      transaction.accountSerialString = transaction.clientCoin?.serial;

      return [transaction];

    default:
      return [transaction];
  }
};
