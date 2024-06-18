import type { TUserCardState } from '@sdk5/shared/requests';

export type TDisplayCardDetails = {
  cvv?: string | number;
  cardHolder: string;
  cardNumber: string;
  expirationDate: string;
  paymentSystem?: string;
  name: string;
  active?: boolean;
  state?: TUserCardState;
};
