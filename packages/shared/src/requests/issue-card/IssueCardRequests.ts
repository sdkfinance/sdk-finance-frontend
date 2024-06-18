import apiConfigInstance from '../../api';
import type { IApiResponse } from '../../types';
import type { IGateTransactionRecord } from '../gate';
import type {
  TGetUserCardDetailsResponse,
  TGetUserCardsResponse,
  TIssueCardPurchasesPayload,
  TUpdateIssuedCardStatePayload,
} from './IssueCardRequests.types';

const { api } = apiConfigInstance;

export const IssueCardRequests = {
  getUserCards(): Promise<TGetUserCardsResponse> {
    return api.get('/issue-card/users/cards');
  },
  viewUserCards(coinSerial: string): Promise<TGetUserCardsResponse> {
    return api.post('/issue-card/users/cards/view', {
      filter: {
        coinSerial,
      },
    });
  },
  getUserCardDetails(cardId: string, options: { showPAN?: boolean; showCVV?: boolean } = {}): Promise<TGetUserCardDetailsResponse> {
    return api.get(`/issue-card/cards/${cardId}`, {
      params: options,
    });
  },
  createIssueCardPurchase(payload: TIssueCardPurchasesPayload): Promise<IApiResponse<IGateTransactionRecord>> {
    return api.post('/issue-card/cards', payload);
  },
  updateIssuedCardState(cardId: string, payload: TUpdateIssuedCardStatePayload) {
    const { reason, reasonCode, state } = payload;
    return api.patch(`/issue-card/cards/${cardId}`, {
      state,
      reason,
      reasonCode,
    });
  },
};
