import type { ICalculateCommissionRecord, ICoin, IGateSubmitTransactionResponse } from '@sdk5/shared';

export interface IGatePaymentCommonFormData {
  account: ICoin;
  gateProviderId: string;
  paymentService: string;
  amount: number;
}
export interface ISuccessOperationEmitPayload extends IGateSubmitTransactionResponse {
  calculatedCommission?: ICalculateCommissionRecord | null;
}
