import type { TCoinType, TTransactionType, TTransactionTypeAll } from '../../constants';
import type { IApiResponse } from '../../types';

export interface IOperationFlowRecord {
  id: string;
  code: TTransactionTypeAll;
  transactionType: TTransactionType;
  processType: string;
  srcCoinType: TCoinType;
  destCoinType: TCoinType;
  isMultiCurrency: boolean;
}

export interface IBankCatalog {
  address: string;
  bankId: string;
  bic: string;
  city: string;
  name: string;
  swift: string;
  zipCode: string;
}

export type IBankCatalogResponse = { records: IBankCatalog[] };
export type IOperationFlowResponse = { records: IOperationFlowRecord[] };
export type IOperationFlowApiResponse = IApiResponse<IOperationFlowResponse>;
