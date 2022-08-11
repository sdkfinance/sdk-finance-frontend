import api from '@/services/api';
import {
  IExchangeRatesApiResponse,
  IExchangeRatesCalculateApiResponse,
  IExchangeRatesCreateBody,
  IExchangeRatesSuccessResponseApiResponse,
  IExchangeRatesViewBody,
  ISetExchangeRatePayload,
} from '@/services/requests/exchange-rates/ExchangeRates.types';

export const ExchangeRatesRequests = {

  getRate(data: IExchangeRatesViewBody): Promise<IExchangeRatesApiResponse> {
    return api.post('/exchange-rates/view', data);
  },

  exchangeCalculate(rateId: string, data: IExchangeRatesCreateBody): Promise<IExchangeRatesCalculateApiResponse> {
    return api.post(`/exchange-rates/${rateId}/exchanges/calculate`, data);
  },

  exchanges(rateId: string, data: IExchangeRatesCreateBody): Promise<IExchangeRatesSuccessResponseApiResponse> {
    return api.post(`/exchange-rates/${rateId}/exchanges`, data);
  },

  setExchangeRate(data: ISetExchangeRatePayload): Promise<any> {
    return api.post('/exchange-rates/rate', data);
  },

};
