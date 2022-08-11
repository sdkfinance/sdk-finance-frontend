import { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '@/types/interfaces';

export interface IContactSocialMedia {
  id: string;
  socialMediaType: string;
  socialMediaReference: string;
}

export interface IContactFilter {
  id: string;
  nickname: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  postCode: string;
  email: string;
  phoneNumber: string;
  swiftBic: string;
  linkedUserId: string;
}

export interface IContactSort {
  date?: string;
}

export interface IContactRecord {
  id: string;
  nickname: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  postCode: string;
  email: string;
  phoneNumber: string;
  photoPath: string;
  socialMedias: IContactSocialMedia[];
  bankAccountNumber: string;
  swiftBic: string;
  ownerId: string;
  linkedUserId: string;
}

export interface IContactPayload {
  nickname: string;
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  country?: string;
  postCode?: string;
  email: string;
  phoneNumber: string;
  photoPath?: string;
  socialMediaList?: IContactSocialMedia[];
  bankAccountNumber?: string;
  swiftBic?: string;
}

export type IGetContactsResponse = IApiResponse<{ contacts: IContactRecord[] }>;
export type IGetContactsPaginateResponse = IApiResponse<IPaginationResponse<IContactRecord>>;
export type IGetContactsOptions = IPaginationRequestOptions<IContactFilter, IContactSort>;
