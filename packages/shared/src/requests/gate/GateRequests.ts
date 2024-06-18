import { api } from '../../api';
import type { IApiResponse } from '../../types';
import type { ITransactionsRecord } from '../transactions';
import type {
  ICalculateCommissionBody,
  ICalculateCommissionRecord,
  IGateCreateTransactionBody,
  IGateIGatePayerFieldsResponse,
  IGateMethodsResponse,
  IGateSubmitPayerBody,
  IGateSubmitTransactionResponse,
  IGateTransactionResponse,
  IPaymentProviderBody,
  IPaymentProvidersResponse,
  TInitTokenizationRequestPayload,
  TViewCardTokensRequestPayload,
  TViewCardTokensResponse,
} from './Gate.types';

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

  submitPayer(tx: string, data: IGateSubmitPayerBody): Promise<IApiResponse<IGateSubmitTransactionResponse>> {
    return api.post(`/gate/transactions/${tx}/submit`, data);
  },
  prepareTransaction(transactionId: string, payload: IGateSubmitPayerBody): Promise<IApiResponse<ITransactionsRecord>> {
    return api.post(`/gate/transactions/${transactionId}/prepare`, payload);
  },
  initTokenization(payload: TInitTokenizationRequestPayload): Promise<IApiResponse<IGateSubmitTransactionResponse>> {
    return api.post('/gate/tokenization', payload);
  },
  viewCardTokens(payload: TViewCardTokensRequestPayload): Promise<IApiResponse<TViewCardTokensResponse>> {
    return api.post('/gate/tokenization/view', payload);
  },
};
