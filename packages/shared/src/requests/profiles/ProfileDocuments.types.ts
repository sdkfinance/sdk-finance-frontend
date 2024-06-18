import type { TProfileDocumentStatus, TProfileDocumentType } from '../../constants/profile-document';
import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse, TSortType } from '../../types';

export type IProfileDocument = {
  file?: IMediaFile;
  id: string;
  label: string;
  type: TProfileDocumentType;
  status: TProfileDocumentStatus;
  documentIdentifier?: string;
};

export interface IProfileDocumentsResponse {
  documents: IProfileDocument[];
}

export interface IUserProfileDocument {
  id: string;
  file?: IMediaFile;
  documentIdentifier: string;
  type: string;
  label?: string;
  status: TProfileDocumentStatus;
  updatedAt: string;
}
export interface IMediaFile {
  id: string;
  ownerId: string;
  mediaType: string;
  name: string;
  url: string;
  md5: string;
  sha1: string;
  size: number;
  used: boolean;
  createdAt?: string;
  expiresAt?: string;
  tag?: string;
}

export type TViewUploadedProfileDocumentsFilter = {
  orgIds: string[];
  statuses: TProfileDocumentStatus[];
  types: string[];
};
export type TViewUploadedProfileDocumentsSort = {
  status: TSortType;
};

export type TViewUploadedProfileDocumentsRequestPayload = IPaginationRequestOptions<
  Partial<TViewUploadedProfileDocumentsFilter>,
  Partial<TViewUploadedProfileDocumentsSort>
>;
export type TViewUploadedProfileDocumentsResponse = IApiResponse<IPaginationResponse<IUserProfileDocument>>;

export interface IChangeUserDocumentStatusRequestPayload {
  status: TProfileDocumentStatus;
}

export type TMediaFile = {
  id: string;
  ownerId: string;
  mediaType: string;
  name: string;
  url: string;
  md5: string;
  sha1: string;
  size: number;
  used: boolean;
  createdAt?: string;
  expiresAt?: string;
  tag?: string;
};

export interface IUploadMediaFileResponse {
  file: TMediaFile;
}

export interface ILinkProfileDocumentResponse {
  document: IUserProfileDocument;
}

export interface IDocumentType {
  type: TProfileDocumentType;
  label: string;
  optional: boolean;
  asPlainText: boolean;
}

export interface IViewDocumentTypesResponse {
  documentTypes: IDocumentType[];
}

export type TViewDocumentTypeApiResponse = IApiResponse<IViewDocumentTypesResponse>;

export interface IUpdateProfileIdentifierPayload extends Pick<IDocumentType, 'type'> {
  identifier: string;
}
export type TUpdateProfileIdentifierResponse = ILinkProfileDocumentResponse;
export type TUpdateProfileIdentifierApiResponse = IApiResponse<TUpdateProfileIdentifierResponse>;
