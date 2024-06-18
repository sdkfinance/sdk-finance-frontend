import type { TBusinessProcessStatus, TBusinessRequestStatus } from '../../constants';
import type { IPaginationRequestOptions, IPaginationResponse, TSortType } from '../../types';

export type TBusinessRequestItem = {
  identifier: number;
  status: TBusinessRequestStatus;
  businessProcessId: string;
  businessProcessType: string;
  businessProcessStatus: TBusinessProcessStatus;
};

export type TViewBusinessRequestResponse = {
  records: TBusinessRequestItem[];
};

export type TViewBusinessRequestsFilters = {
  identifiers: string[];
  statuses: TBusinessRequestStatus[];
  businessProcessTypes: string[];
};

export type TViewBusinessRequestsSortOptions = {
  date: TSortType;
};

export type TChangeBusinessRequestStatusPayload = {
  type: 'approve' | 'decline';
  requestIdentifier: number;
};

export type TChangeBusinessRequestStatusResponse = TViewBusinessRequestResponse;
export type TViewBusinessRequestPayload = IPaginationRequestOptions<Partial<TViewBusinessRequestsFilters>, Partial<TViewBusinessRequestsSortOptions>>;
export type TViewBusinessRequestsResponse = IPaginationResponse<TBusinessRequestItem>;
