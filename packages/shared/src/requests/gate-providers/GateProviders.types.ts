import type { TTxType } from '../../constants';
import type { IOrganizationRecord } from '../organizations';

export interface IAccountSetting {
  label?: string;
  name: string;
  value: object;
}
export interface IAccountSettingRequest {
  fields: IAccountSetting[];
}

export interface ISupportTransaction {
  paymentWay: string;
  transactionType: TTxType;
}

export interface IGate {
  name: string;
}

export interface IGateSetting {
  id: string;
  name: string;
  organization: IOrganizationRecord;
  gate: IGate;
  debtAllowed: boolean;
  supportedTransactions: ISupportTransaction[];
  active: boolean;
}

export interface IGateRecord {
  name: string;
  id: string;
  custom: boolean;
}

export type ICustomProviderResponse = Pick<IGateSetting, 'id' | 'name' | 'gate'>;

export interface IViewGateResponse {
  gates: IGateRecord[];
}

export interface IGateSettingResponse {
  records: IGateSetting[];
}

export interface IUpdateGateProviderPayload extends Pick<IGateSetting, 'active' | 'debtAllowed'> {
  gateProviderId: string;
  vendorName: string;
}
