export interface ISmartCardShort {
  id: string;
  name: string;
  active: boolean;
  cardNumber: number;
  expirationDate: string;
  expirationStatus: 'ACTIVE' | 'EXPIRED';
}

export interface ISmartCardRecord extends ISmartCardShort {
  organizationId: string;
  createdAt: string;
  associatedCoinSerial: string;
  currencyCode: string;
  cvv?: string;
  paymentSystem?: string;
  availableAmount: number;
}
