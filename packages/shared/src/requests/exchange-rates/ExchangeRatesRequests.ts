import { api } from '../../api';
import type { IExchangeRatesApiResponse, IExchangeRatesViewBody, ISetExchangeRatePayload, TSetExchangeRateResponse } from './ExchangeRates.types';

export const ExchangeRatesRequests = {
  getRate(data: IExchangeRatesViewBody): Promise<IExchangeRatesApiResponse> {
    return api.post('/exchange-rates/view', data);
  },
  // Not used
  // exchangeCalculate(rateId: string, data: IExchangeRatesCreateBody): Promise<IExchangeRatesCalculateApiResponse> {
  //   return api.post(`/exchange-rates/${rateId}/exchanges/calculate`, data);
  // },
  // Not used
  // exchanges(rateId: string, data: IExchangeRatesCreateBody): Promise<IExchangeRatesSuccessResponseApiResponse> {
  //   return api.post(`/exchange-rates/${rateId}/exchanges`, data);
  // },

  setExchangeRate(data: ISetExchangeRatePayload): Promise<TSetExchangeRateResponse> {
    return api.post('/exchange-rates/rate', data);
  },
};
