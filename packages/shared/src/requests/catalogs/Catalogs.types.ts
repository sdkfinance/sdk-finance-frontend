import type { TCoinType, TRANSACTION_TYPES } from '../../constants';
import type { IApiResponse } from '../../types';

export type TTransactionType = keyof typeof TRANSACTION_TYPES;

export interface IOperationFlowRecord {
  id: string;
  code: string;
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
