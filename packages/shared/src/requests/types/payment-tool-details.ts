export type TPaymentToolDetailsType = 'COIN' | 'SMART_CARD';

export interface IPaymentToolDetails {
  type: TPaymentToolDetailsType;
  srcValue: string;
  srcId: string;
  destValue: string;
  destId: string;
  currency: string;
  symbol: string;
  recipientFullName: string;
}
