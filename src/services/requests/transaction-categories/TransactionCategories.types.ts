import { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '@/types/interfaces';

export interface ITransactionCategoryFilter {
  code: string;
  name: string;
}

export interface ITransactionCategorySort {
}
export interface ITransactionCategoryRecord {
  code: string;
  name: string;
  id: string;
  imageLink: string;
}

type ITransactionCategoryResponse = IPaginationResponse<ITransactionCategoryRecord>;
export type ITransactionCategoryOptions = IPaginationRequestOptions<ITransactionCategoryFilter, ITransactionCategorySort>;
export type IGetTransactionCategory = IApiResponse<ITransactionCategoryResponse>;
