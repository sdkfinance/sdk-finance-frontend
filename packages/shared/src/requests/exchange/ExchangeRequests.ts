import { api } from '../../api';
import type { IApiResponse } from '../../types';
import type { TViewBusinessRequestResponse } from '../business-requests';
import type {
  IExchangeCalculateApiResponse,
  IExchangePayload,
  IExchangeSuccessResponseApiResponse,
  TExecuteExchangeReserveOperationRequestPayload,
} from './Exchange.types';

export const ExchangeRequests = {
  exchangeCalculate(data: IExchangePayload): Promise<IExchangeCalculateApiResponse> {
    return api.post('/exchange/calculator', data);
  },

  exchanges(data: IExchangePayload): Promise<IExchangeSuccessResponseApiResponse> {
    return api.post('/exchange', data);
  },

  initiateTopUpRequest(payload: TExecuteExchangeReserveOperationRequestPayload): Promise<IApiResponse<TViewBusinessRequestResponse>> {
    return api.post('/exchange/reserve-top-up/create-request', payload);
  },

  initiateWithdrawRequest(payload: TExecuteExchangeReserveOperationRequestPayload): Promise<IApiResponse<TViewBusinessRequestResponse>> {
    return api.post('/exchange/reserve-withdrawal/create-request', payload);
  },
};
