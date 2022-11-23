import { ITransactionCategoryRecord } from '@/services/requests/transaction-categories/TransactionCategories.types';
import { IApiResponse } from '@/types/interfaces';

export interface IReportsCoinOutflowsParams {
  currency?: string;
  from?: string;
  to?: string;
  showOnlyActive?: string;
}

export interface IReportsCoinOutflowsRecord {
  categoryId: string;
  sum: number;
  percentage: number;
  numberOfOperations: number;
  currencyCode: string;
  currencySymbol: string;
}

export interface IReportsCoinOutflowsRecordClient extends IReportsCoinOutflowsRecord {
  color: string;
  category: ITransactionCategoryRecord;
}

export interface IReportsCoinDetailsCoinEntry {
  currency: string;
  amount: number;
  issuerId: string;
  symbol: string;
}

export interface IReportsCoinDetails {
  amount: number;
  percentFromTotal: number;
  roundedAmount: number;
  currency: string;
  coinEntry: IReportsCoinDetailsCoinEntry;
  symbol: string;
}

export interface IReportsCoinDetailsRecord{
  totalAmount: number;
  roundedTotalAmount: number;
  currency: string;
  coinsDetail: IReportsCoinDetails[];
  symbol: string;
}

export interface IReportMoneyFlow {
  currencyCode: string;
  currencySymbol: string;
  inflowSum: number;
  outflowSum: number;
}

export interface IReportMoneyFlowParams {
  currency?: string;
  from?: string;
  to?: string;
}

export type IReportsCoinOutflowsResponse = IApiResponse<{ records: IReportsCoinOutflowsRecord[] }>;
export type IReportsCoinDetailsResponse = IApiResponse<IReportsCoinDetailsRecord>;
