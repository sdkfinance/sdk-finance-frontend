import type { ITransactionsTransaction } from '../transactions';
import type { ICalculatedCommission, IClientCoin } from '../types';

export interface IBankWithdrawalDetails {
  name: string | null;
  bankAccountNumber: string | null;
  address: string | null;
  bic: string | null;
  fullName: string | null;
  iban: string | null;
  swift: string | null;
}

export interface IBankWithdrawalBody {
  coin: string;
  amount: number;
  bankDetails: IBankWithdrawalDetails;
  description?: string;
  currency?: string;
}

export type IBankWithdrawalCommissionResponse = ICalculatedCommission;

export interface IBankWithdrawalRecord {
  bankInfo: IBankWithdrawalDetails;
  cashAmount: number;
  children: [];
  clientCoin: IClientCoin;
  createdAt: string;
  fullName: string;
  id: string;
  requestIdentifier: number;
  requestStatus: string;
  transactions: ITransactionsTransaction;
  type: string;
  updatedAt: string;
}

export interface ICreateWithdrawalRequestPayload {
  coinSerial: string;
  amount: number;
  bankAccountId?: string;
  customInformation?: string;
  description?: string;
}

export type IBankWithdrawalCreateResponse = { process: IBankWithdrawalRecord };
