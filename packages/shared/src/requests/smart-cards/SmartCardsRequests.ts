import { api } from '../../api';
import type { IApiResponse } from '../../types';
import type {
  ISmartCardActionResponse,
  ISmartCardCreatePayload,
  ISmartCardResponse,
  ISmartCardUpdatePayload,
  TViewSmartCardsRequestPayload,
  TViewSmartCardsResponse,
} from './SmartCards.types';

type IPlainObject = Record<string, any>;

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

  viewSmartCards(payload: TViewSmartCardsRequestPayload): Promise<TViewSmartCardsResponse> {
    return api.post('/smart-cards/view', payload);
  },
  updateSmartCardBusinessRole(cardNumber: number, active: boolean): Promise<ISmartCardActionResponse> {
    return api.patch(`/smart-cards/${cardNumber}`, { active });
  },
};
