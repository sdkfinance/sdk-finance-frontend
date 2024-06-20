import type { TTxType } from '../../constants';
import type { IDynamicField, IPaginationRequestOptions, IPaginationResponse } from '../../types';
import type { IWalletRecord } from '../coins';
import type { ICurrency } from '../currencies';
import type { IGateSetting } from '../gate-providers';

export type TGatePaymentFieldsRecord = Record<string, string | number | boolean>;
export type TPaymentWay = 'EMONEY' | 'CARD' | 'CARD_TOKEN' | 'TERMINALS' | 'BANK' | 'TERMINAL' | 'CARD_ISSUING';
export type TPaymentProviderService = {
  active: boolean;
  currencyCode: string;
  enabled: boolean;
  id: string;
  service: string;
  serviceMethod: string;
  type: string;
  icon?: string;
  logo?: string;
};
export type TGatePaymentProvider = Pick<IGateSetting, 'id' | 'name' | 'gate' | 'active' | 'debtAllowed'>;
export interface IPaymentProviderRecord {
  gateProvider: TGatePaymentProvider;
  way: TPaymentWay;
  icon?: string;
  services?: TPaymentProviderService[];
}

export interface ICalculateCommissionBody {
  gateProviderId: string;
  serial: string;
  amount: number;
  txType: TTxType;
  payerId?: string;
}

export interface ICalculateCommissionRecord {
  sourceAmount: number;
  amountToSend: number;
  commissionAmount: number;
  currency: ICurrency;
}

export interface IGateCreateTransactionBody {
  coin: string;
  amount: number;
  type: TTxType;
  deviceId?: string;
  deviceOrderId?: string;
  method: {
    gateProviderId: string;
    way: string;
  };
  description?: string;
}

export type TGateTransactionStatus = 'INITIATED' | 'PROVIDER_ASSIGNED' | 'PENDING' | 'PROVIDER_PROCCESSED' | 'PROCESSED' | 'FAILURE' | 'EXCEPTION';

export interface IGateTransactionRecord {
  id: string;
  orderId: number;
  deviceId: string;
  deviceOrderId: string;
  type: string;
  status: TGateTransactionStatus;
  errorCode: string;
  coin: IWalletRecord;
  paymentMethod: IPaymentProviderRecord;
  sourceAmount: number;
  amountToSend: number;
  finalAmount: number;
  processId: string;
  payerData: {};
}

export interface IGatePayerField {
  name: string;
  value: string | number | boolean;
}

export interface IGatePayerFields {
  name: string;
  fields: IDynamicField[];
}

export interface IGateSubmitPayerBody {
  optionName: string;
  fields: TGatePaymentFieldsRecord;
}

export interface IPaymentProviderBody {
  txType: TTxType;
  serial: string;
}

export interface IGateTransactionForm {
  url: string;
  method: string;
  parameters: Record<string, string>;
}

export type TUsePaymentMethod = {
  gateProviderId: string;
  way: TPaymentWay;
};

export type TInitTokenizationRequestPayload = {
  coin: string;
  method: TUsePaymentMethod;
  fields: TGatePaymentFieldsRecord;
};

export type TVerificationTokenRecord = {
  id: string;
  mask: string;
  expiredAt: string;
  token: string;
  gateProviderId: string;
  currencyCode: string;
};

export type TViewCardTokensRequestPayload = Pick<IPaginationRequestOptions<{}, undefined>, 'pageNumber' | 'pageSize' | 'filter'>;
export type TViewCardTokensResponse = IPaginationResponse<TVerificationTokenRecord>;

export type IPaymentProvidersResponse = { records: ICalculateCommissionRecord[] };
export type IGateMethodsResponse = { records: IPaymentProviderRecord[] };
export type IGateIGatePayerFieldsResponse = { options: IGatePayerFields[] };
export type IGateTransactionResponse = { transaction: IGateTransactionRecord };
export type IGateSubmitTransactionResponse = IGateTransactionResponse & {
  form?: IGateTransactionForm;
};
