import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '../../types';

export interface ITransactionCategoryFilter {
  code: string;
  name: string;
}

export type ITransactionCategorySort = {};
export interface ITransactionCategoryRecord {
  code: string;
  name: string;
  id: string;
  imageLink: string;
}

type ITransactionCategoryResponse = IPaginationResponse<ITransactionCategoryRecord>;
export type ITransactionCategoryOptions = IPaginationRequestOptions<ITransactionCategoryFilter, ITransactionCategorySort>;
export type IGetTransactionCategory = IApiResponse<ITransactionCategoryResponse>;
