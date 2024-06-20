import type { IApiResponse, IPaginationRequestOptions } from '../../types';
import type { ITransactionsFilter, ITransactionsRecord } from '../transactions';
import type { ICalculatedCommission, IPaymentToolDetails } from '../types';

export type ITransfersFilter = ITransactionsFilter;

export interface ITransfersSort {
  createdAt?: string;
  status?: string;
  type?: string;
}

export type ITransfersTransaction = Pick<
  ITransactionsRecord,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'type'
  | 'status'
  | 'categoryName'
  | 'categoryImageLink'
  | 'requestIdentifier'
  | 'requestStatus'
  | 'internalSourceAmount'
  | 'internalDestinationAmount'
  | 'externalSourceAmount'
  | 'externalDestinationAmount'
  | 'sourceCurrency'
  | 'description'
  | 'transactions'
  | 'children'
  | 'errorMessage'
  | 'amount'
  | 'commission'
  | 'netAmount'
  | 'operationAmountDetails'
  | 'from'
  | 'to'
  | 'sender'
  | 'recipient'
> & {
  paymentToolDetails: IPaymentToolDetails;
  description: string;
};

export type ITransfersRecord = ITransfersTransaction;

export interface ITransferBody {
  paymentTool: Pick<IPaymentToolDetails, 'type' | 'srcValue' | 'destValue'>;
  amount: number | null;
  description: string;
}

export interface ITransferCalculateResponse extends ICalculatedCommission {
  paymentToolDetails: IPaymentToolDetails;
}

export type ITransfersOptions = IPaginationRequestOptions<ITransfersFilter, ITransfersSort>;
export type TTransferResponse = { process: ITransfersTransaction };
export type ITransfersApiResponse = IApiResponse<TTransferResponse>;
