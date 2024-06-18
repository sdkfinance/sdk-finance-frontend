import type { TTxType } from '../../constants';

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

export interface IGateSetting {
  id: string;
  name: string;
  organization: {
    contract_info: {
      id: string;
      personType: string;
      name: string;
    };
    id: string;
    identificationStatus: string;
    message: string;
    name: string;
    status: string;
    type: string;
  };
  gate: {
    name: string;
  };
  supportedTransactions: ISupportTransaction[];
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
