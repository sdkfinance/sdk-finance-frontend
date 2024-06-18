import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '../../types';

export interface IActionsOfUsersFilter {
  actionIds?: string[];
  userIds?: string[];
  userIps?: string[];
  hosts?: string[];
  performedAtFrom?: string;
  performedAtTo?: string;
}

export interface IActionsOfUsersSort {
  dateCreated?: string;
}

export interface IActionsOfUsersRecord {
  actionId: string;
  userId: string;
  comment: string;
  performedAt: string;
  requestInfo: {
    host: string;
    userAgent: string;
    userIp: string;
  };
}

type TAction = {
  role?: string;
  actionType: string;
  entityId: string;
  entityName: string;
  type: string;
};
export interface IActionsRecord {
  actionId: string;
  objectsOfAction: TAction[];
}

export interface IActionsResponse {
  records: IActionsRecord[];
}

export type IActionsApiResponse = IApiResponse<IActionsResponse>;

type IActionsOfUsersResponse = IPaginationResponse<IActionsOfUsersRecord>;

export type IActionsOfUsersOptions = IPaginationRequestOptions<IActionsOfUsersFilter, IActionsOfUsersSort>;

export type IGetActionsOfUsersApiResponse = IApiResponse<IActionsOfUsersResponse>;
