import { IIssuer } from '@/services/requests/exchange-rates/ExchangeRates.types';
import { ITransactionsTransaction } from '@/services/requests/transactions/Transactions.types';

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

export interface IBankWithdrawalCommissionResponse {
    status: string;
    message: string;
    transactionAmount: number;
    senderAmountPush: number;
    recipientAmountPush: number;
    commissionAmountPush: number;
    issuer: IIssuer;
}

export interface IClientCoin {
    name: string;
    organizationId: string;
    organizationName: string;
    serial: string;
    technical: boolean;
    type: string;
    issuer: IIssuer;
}

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
    status: string;
    transactions: ITransactionsTransaction;
    type: string;
    updatedAt: string;
}

export type IBankWithdrawalCreateResponse = { process: IBankWithdrawalRecord }
