import api from '@/services/api';
import { IApiResponse, IPlainObject } from '@/types/interfaces';
import {
  ISmartCardActionResponse,
  ISmartCardCreatePayload,
  ISmartCardResponse,
  ISmartCardUpdatePayload,
} from '@/services/requests/smart-cards/SmartCards.types';

export const SmartCardsRequests = {

  getUserCardBySerial(coinSerial: string): Promise<ISmartCardResponse> {
    return api.get(`/smart-cards/my/coin/${coinSerial}`);
  },

  getUserCardById(smartCardId: string): Promise<ISmartCardResponse> {
    return api.get(`/smart-cards/my/${smartCardId}`);
  },

  getUserCards(): Promise<ISmartCardResponse> {
    return api.get('/smart-cards/my');
  },

  createUserCard(data: ISmartCardCreatePayload): Promise<ISmartCardActionResponse> {
    return api.post('/smart-cards/my', data);
  },

  updateUserCard(cardNumber: string, data: ISmartCardUpdatePayload): Promise<ISmartCardActionResponse> {
    return api.patch(`/smart-cards/my/number/${cardNumber}`, data);
  },

  deleteUserCard(cardNumber: string): Promise<IApiResponse<IPlainObject>> {
    return api.delete(`/smart-cards/my/number/${cardNumber}`);
  },

};
