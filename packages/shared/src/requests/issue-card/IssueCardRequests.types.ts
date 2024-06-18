import type { TIssuedCardTransitionReasonCode } from '../../constants';
import type { IApiResponse } from '../../types';

export type TUserCardState = 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | 'UNSUPPORTED' | 'UNACTIVATED' | 'LIMITED';
export type TUserCardFulfillmentStatus = 'ISSUED' | 'ORDERED' | 'REORDERED' | 'REJECTED' | 'SHIPPED' | 'DELIVERED' | 'DIGITALLY_PRESENTED';
export type TUserCardInstrumentType = 'PHYSICAL_MSR' | 'PHYSICAL_ICC' | 'PHYSICAL_CONTACTLESS' | 'PHYSICAL_COMBO' | 'VIRTUAL_PAN';
export type TUserCardDetailedMetadata = Record<string, string>;

export type TUserIssuedCard = {
  cardId: string;
  cardProductId: string;
  cardProductToken: string;
  cardToken: string;
  name: string;
  organizationId: string;
  state: TUserCardState;
};

export type TUserCardDetailed = {
  createdTime: Date;
  lastModifiedTime: Date;
  token: string;
  userToken: string;
  cardProductToken: string;
  lastFour: string;
  pan: string;
  expiration: string;
  expirationTime: Date;
  barcode: string;
  pinIsSet: boolean;
  state: TUserCardState;
  stateReason: string;
  fulfillmentStatus: TUserCardFulfillmentStatus;
  instrumentType: TUserCardInstrumentType;
  expedite: boolean;
  metadata: TUserCardDetailedMetadata;
  cvvNumber?: number;
};

export type TIssueCardPurchasesPayload = {
  serial: string;
  productId: string;
  description: string;
};

export type TUpdateIssuedCardStatePayload = {
  state: TUserCardState;
  reason: string;
  reasonCode: TIssuedCardTransitionReasonCode;
};

export type TGetUserCardsResponse = IApiResponse<{ records: TUserIssuedCard[] }>;
export type TGetUserCardDetailsResponse = IApiResponse<{ records: [TUserCardDetailed] }>;
