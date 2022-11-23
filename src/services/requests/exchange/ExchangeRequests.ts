import api from '@/services/api';
import {
  IExchangeCalculateApiResponse,
  IExchangePayload,
  IExchangeSuccessResponseApiResponse,
} from '@/services/requests/exchange/Exchange.types';

export const ExchangeRequests = {

  exchangeCalculate(data: IExchangePayload): Promise<IExchangeCalculateApiResponse> {
    return api.post('/exchange/calculator', data);
  },

  exchanges(data: IExchangePayload): Promise<IExchangeSuccessResponseApiResponse> {
    return api.post('/exchange', data);
  },

};
