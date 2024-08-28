import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse, ISmartCardRecord } from '../../types';

export interface ISmartCardUpdatePayload {
  name: string;
  active: boolean;
}

export interface ISmartCardFilter {
  cardNumber: string;
  organizationIds: string[];
  active: boolean;
}

export interface ISmartCardSort {
  createdAt: 'asc' | 'desc';
}

export interface ISmartCardCreatePayload extends ISmartCardUpdatePayload {
  associatedCoinSerial: string;
}
export type TViewSmartCardsFilters = {
  cardNumber?: string;
  organizationIds?: string[];
  active?: boolean;
  associatedCoinSerial?: string;
};
export type TViewSmartCardsSortOptions = ISmartCardSort;
export type TViewSmartCardsRequestPayload = IPaginationRequestOptions<TViewSmartCardsFilters, TViewSmartCardsSortOptions>;
export type TViewSmartCardsResponse = IApiResponse<IPaginationResponse<ISmartCardRecord>>;

export type IGetSmartCardOptions = IPaginationRequestOptions<ISmartCardFilter, ISmartCardSort>;
export type IGetSmartCardResponse = IPaginationResponse<ISmartCardRecord>;
export type ISmartCardResponse = IApiResponse<{ records: ISmartCardRecord[] }>;
export type ISmartCardActionResponse = IApiResponse<{ smartCard: ISmartCardRecord }>;
