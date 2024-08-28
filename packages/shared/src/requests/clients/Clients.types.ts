import type { IGetUsersApiResponse, IGetUsersOptions, IUserRecord } from '../users';

export interface IClientsRecord extends IUserRecord {
  organizationId?: string;
  clientRole?: string;
  contract?: string;
  kycStatus?: string;
}
export type IGetClientsOptions = IGetUsersOptions;
export type IGetClientsApiResponse = IGetUsersApiResponse;
