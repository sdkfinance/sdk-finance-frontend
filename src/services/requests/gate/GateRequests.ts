import api from '@/services/api';
import {
  ICalculateCommissionBody,
  ICalculateCommissionRecord,
  IGateCreateTransactionBody,
  IGateIGatePayerFieldsResponse,
  IGateMethodsResponse,
  IGateSubmitPayerBody,
  IGateTransactionResponse,
  IPaymentProviderBody,
  IPaymentProvidersResponse,
} from '@/services/requests/gate/Gate.types';
import { IApiResponse } from '@/types/interfaces';

export const GateRequests = {

  getPaymentProviders(data: IPaymentProviderBody): Promise<IApiResponse<IPaymentProvidersResponse>> {
    return api.post('/gate/methods/view', data);
  },

  calculateCommission(data: ICalculateCommissionBody): Promise<IApiResponse<ICalculateCommissionRecord>> {
    return api.post('/gate/transactions/calculate', data);
  },

  getMethods(data: IPaymentProviderBody): Promise<IApiResponse<IGateMethodsResponse>> {
    return api.post('/gate/methods/view', data);
  },

  createTransaction(data: IGateCreateTransactionBody): Promise<IApiResponse<IGateTransactionResponse>> {
    return api.post('/gate/transactions', data);
  },

  getPayerFields(tx: string): Promise<IApiResponse<IGateIGatePayerFieldsResponse>> {
    return api.get(`/gate/transactions/${tx}/payer-fields/`);
  },

  submitPayer(tx: string, data: IGateSubmitPayerBody): Promise<IApiResponse<IGateTransactionResponse>> {
    return api.post(`/gate/transactions/${tx}/submit`, data);
  },

};
