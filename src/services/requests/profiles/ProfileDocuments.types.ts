export interface IProfileDocument {
  file?: {
    id: string;
    name: string;
    ownerId: string;
    size: number;
    url: string;
  };
  id: string;
  label: string;
  type: string;
  status: string;
  documentIdentifier?: string;
}

export interface IProfileDocumentsResponse {
  documents: IProfileDocument[];
}

export interface IUserProfileDocument {
  id: string;
  file: IUserProfileFile;
  documentIdentifier: string;
  type: string;
  label: string;
  status: string;
  updatedAt: string;
}
export interface IUserProfileFile {
  id: string;
  ownerId: string;
  mediaType: string;
  name: string;
  url: string;
  md5: string;
  sha1: string;
  size: number;
  used: boolean;
  createdAt: string;
  expiresAt: string;
  tag: string;
}
