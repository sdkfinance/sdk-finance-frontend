import type { ITransactionCategoryRecord } from '@sdk5/shared/requests';
import type { IApiResponse } from '@sdk5/shared/types';

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
  currencyId: string;
}

export interface IReportsCoinOutflowsRecordClient extends IReportsCoinOutflowsRecord {
  color: string;
  category: ITransactionCategoryRecord;
}

export interface IReportsCoinDetailsCoinEntry {
  currency: string;
  amount: number;
  currencyId: string;
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

export interface IReportsCoinDetailsRecord {
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

export type IReportMoneyFlowParams = IReportsCoinOutflowsParams;

export type IReportsCoinOutflowsResponse = IApiResponse<{ records: IReportsCoinOutflowsRecord[] }>;
export type IReportsCoinDetailsResponse = IApiResponse<IReportsCoinDetailsRecord>;
