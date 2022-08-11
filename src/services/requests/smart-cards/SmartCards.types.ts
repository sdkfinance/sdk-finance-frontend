import { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '@/types/interfaces';

export interface ISmartCardShort {
    id: string;
    name: string;
    active: boolean;
    cardNumber: string;
    expirationDate: string;
    expirationStatus: 'ACTIVE' | 'EXPIRED';
}

export interface ISmartCardRecord extends ISmartCardShort{
    organizationId: string;
    createdAt: string;
    associatedCoinSerial: string;
    currencyCode: string;
    cvv?: string;
    paymentSystem?: string;
}

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

export type IGetSmartCardOptions = IPaginationRequestOptions<ISmartCardFilter, ISmartCardSort>;
export type IGetSmartCardResponse = IPaginationResponse<ISmartCardRecord>;
export type ISmartCardResponse =IApiResponse<{ records: ISmartCardRecord[] }>;
export type ISmartCardActionResponse =IApiResponse<{smartCard: ISmartCardRecord}>;
