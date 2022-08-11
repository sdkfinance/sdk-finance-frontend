import { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '@/types/interfaces';

export interface IOrganizationTypes {
    additionalIssuableCoinTypes?: string[];
    autoDeletable?: boolean;
    registrable?: boolean;
    coinType?: string;
    issuableCoinTypes?: string[];
    bundleKey?: string;
    business?: string;
    code?: string;
}

export interface IOrganizationsFilter {
    types?: string[];
    emitentId?: string;
    organizationTypes?: IOrganizationTypes[];
}

export interface IOrganizationsSort {
    createdAt?: string;
}

interface IContactInfo {
    id: string;
    personType: string;
    name: string;
}

export interface IOrganizationRecord {
    'contract_info': IContactInfo;
    id: string;
    identificationStatus: string;
    message: string;
    name: string;
    status: string;
    type: string;
}

export type IGetOrganizationsOptions = IPaginationRequestOptions<IOrganizationsFilter, IOrganizationsSort>;
export type IGetOrganizationsResponse = IPaginationResponse<IOrganizationRecord>;
export type IGetOrganizationsApiResponse = IApiResponse<IGetOrganizationsResponse>;
