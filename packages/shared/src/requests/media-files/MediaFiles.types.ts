import type { IApiResponse } from '../../types';

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
export interface IUploadMediaResponse {
  file: IMediaFile;
}
export type TUploadMediaApiResponse = IApiResponse<IUploadMediaResponse>;
