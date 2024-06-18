import type { TBusinessProcessStatus, TTransactionType } from '../../constants';
import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '../../types';
import type { ICurrency, ICurrencyShort } from '../currencies';
import type { IBankInfo, ICoin, TTransactionCoin } from '../types';

export interface ITransactionsFilter {
  ids?: string[];
  types?: string[];
  statuses?: string[];
  createdAtFrom?: string;
  createdAtTo?: string;
  coinSerials?: string[];
  senderCoinNames?: string[];
  recipientCoinNames?: string[];
  orgIds?: string[];
  currencyCodes?: string[];
  requestIdentifiers?: number[];
  fromEmails?: string[];
  toEmails?: string[];
  fromPhoneNumbers?: string[];
  toPhoneNumbers?: string[];
  currenciesIds?: string[];
}

export interface ITransactionsSort {
  createdAt?: string;
  status?: string;
  type?: string;
}

export interface ITransactionsTransaction {
  amount: number;
  to: TTransactionCoin;
  from: TTransactionCoin;
  id: string;
  parentId: string;
  currency: ICurrency;
  performedAt: string;
  type: string;
  updatedAt: string;
}

export interface IOperationAmountDetails {
  senderGrossAmount: number;
  senderNetAmount: number;
  senderFee: number;
  recipientGrossAmount: number;
  recipientNetAmount: number;
  recipientFee: number;
}

export type TBusinessProcessCommissionDetails = {
  total?: number;
  system?: number;
  provider?: number;
  providerDebt?: number;
};

export type TBusinessProcessCommissionAmount = {
  source: TBusinessProcessCommissionDetails;
  destination: TBusinessProcessCommissionDetails;
};

export type TTParticipantType = 'ORGANIZATION' | 'USER' | 'SYSTEM';
export type TTParticipantTariffPlan = 'base' | 'standard' | 'gold' | 'vip' | 'invest';

export type TParticipant = {
  id: string;
  type: TTParticipantType;
  entityId?: string;
  name?: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  organizationType: string;
  tariffPlan?: TTParticipantTariffPlan;
};

export type TTransactionChildProcessCoin = Pick<ICoin, 'name' | 'serial' | 'type'> & {
  currency: ICurrencyShort;
  organizationId: string;
  organizationName: string;
  technical: boolean;
};

export type TTransactionChildProcess = Pick<
  ITransactionsRecord,
  | 'categoryCode'
  | 'categoryImageLink'
  | 'categoryName'
  | 'createdAt'
  | 'id'
  | 'outgoingAmount'
  | 'incomingAmount'
  | 'status'
  | 'transactions'
  | 'type'
  | 'updatedAt'
> & {
  children: TTransactionChildProcess[];
  coin: TTransactionChildProcessCoin;
};

export type ITransactionRecordExchangeDirection = 'SELL' | 'BUY';

export interface ITransactionsRecord {
  productId?: string;
  netAmount: number;
  children: TTransactionChildProcess[];
  createdAt: string;
  updatedAt: string;
  description: string;
  id: string;
  to: TTransactionCoin;
  from: TTransactionCoin;
  clientCoin?: TTransactionCoin;
  requestIdentifier: number;
  requestStatus: string;
  status: TBusinessProcessStatus;
  posCompanyName?: string;
  categoryImageLink?: string;
  categoryName?: string;
  sender?: TParticipant;
  recipient?: TParticipant;
  transactions?: ITransactionsTransaction[];
  type: TTransactionType;
  amount: number;
  invoiceAmount: number;
  cashAmount: number;
  commission: number;
  incomingAmount: number;
  outgoingAmount: number;
  operationAmountDetails?: IOperationAmountDetails;
  merchantCoinSerial?: string | number;
  invoiceIdentifier?: string;
  internalSourceAmount?: number;
  internalDestinationAmount?: number;
  externalSourceAmount?: number;
  externalDestinationAmount?: number;
  sourceCurrency?: ICurrencyShort;
  destinationCurrency?: ICurrencyShort;
  errorMessage?: string;
  categoryCode: string;
  customInformation?: string;
  commissionAmounts?: TBusinessProcessCommissionAmount;
  commissionAmount?: number;
  bankAccountNumber?: string;
  bankInfo?: Partial<IBankInfo>;
  iban?: string;
  targetClientCoin?: ICoin;
  sourceClientCoin?: ICoin;
  exchangeDirectionType?: ITransactionRecordExchangeDirection;
  exchangeReserveCoin?: ICoin;
  coinDto?: TTransactionCoin[];
}

export interface ITransactionRecordComputed extends ITransactionsRecord {
  totalAmountString?: string;
  amountString?: string;
  detailsCurrencySign?: string;
  feeString?: string;
  title?: string;
  currencySymbol?: string;
  isCurrentUserAreRecipient?: boolean;
  color?: string;
  amountDetailsString?: string | number;
  senderNameString?: string | null;
  recipientNameString?: string | null;
  grossAmountString?: string | number;
  netAmountString?: string | number;
  recipientFeeString?: string | number | null;
  senderFeeString?: string | number | null;
  recipientAccountSerialString?: string | number;
  commissionString?: string | number;
  accountNameString?: string;
  accountSerialString?: string | number;
  boughtAmountString?: string | null;
  soldAmountString?: string | null;
  invoiceIdString?: string | null;
  transactionIdString?: string | null;
  amountSource?: number;
  amountDestination?: number;
  commissionSender?: number;
  commissionRecipient?: number;
  amountDestinationCurrencySymbol?: string;
  amountSourceCurrencySymbol?: string;
  companyNameString?: string;
  bankNameString?: string;
  bankBicString?: string;
  ibanString?: string;
  productIdString?: string;
  senderName?: string;
  senderId?: string;
  receiverName?: string;
  receiverId?: string;
  totalCommission?: number;
  walletAmountString?: string;
  walletHeldAmountString?: string;
  balanceDetails?: {
    amountSource?: string;
    amountDestination?: string;
    providerCommission?: string;
    systemCommission?: string;
    totalCommission?: string;
    commissionSender?: string;
    commissionDestination?: string;
    calculatedProviderFee?: string;
  };
}

export interface ITransactionResponse {
  process: ITransactionsRecord;
}

type ITransactionsResponse = IPaginationResponse<ITransactionsRecord>;

type ITransactionsComputedResponse = IPaginationResponse<ITransactionRecordComputed>;

export type ITransactionsOptions = IPaginationRequestOptions<ITransactionsFilter, ITransactionsSort>;

export type IGetTransactionsApiResponse = IApiResponse<ITransactionsResponse>;

export type IGetTransactionApiResponse = IApiResponse<ITransactionResponse>;

export type IGetTransactionsComputedApiResponse = IApiResponse<ITransactionsComputedResponse>;

export type ITransactionsSingleApiResponse = IApiResponse<{ process: ITransactionsRecord }>;
