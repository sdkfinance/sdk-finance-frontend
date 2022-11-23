import { IClientCoin } from '@/services/requests/bank-withdrawals/Withdrawal.interface';
import { ICurrency } from '@/services/requests/currencies/Currency.types';
import { IIssuer } from '@/services/requests/exchange-rates/ExchangeRates.types';
import { ITransactionsRecord } from '@/services/requests/transactions/Transactions.types';

export interface IIssuerFull {
    id: string;
    sn: string;
    name: string;
    description: string;
    orderNumber: number;
    orderQuote: number;
    active: boolean;
    currency: ICurrency;
}

export interface ICashDeskRecord {
    id: string;
    name: string;
    issuers: IIssuerFull[];
    address: string;
    type: string;
    coordinate: {
        latitude: string;
        longitude: string;
    };
}

export interface ICashDeskCommissionRecord {
    status: string;
    message: string;
    transactionAmount: number;
    senderAmountPush: number;
    recipientAmountPush: number;
    commissionAmountPush: number;
    issuer: IIssuer;
}

export interface ICashDeskBody {
    coin: string;
    amount: number;
    receiverName: string;
}

export interface ICashDeskExecuteRecord {
    cashAmount: number;
    cashDeskId: string;
    charger: object;
    children: [];
    clientCoin: IClientCoin;
    createdAt: string;
    id: string;
    requestIdentifier: number;
    requestStatus: string;
    status: string;
    type: string;
    updatedAt: string;
    transaction: ITransactionsRecord[];
}

export type ICashDeskResponse = { records: ICashDeskRecord[] }
export type ICashDeskExecuteResponse = { process: ICashDeskExecuteRecord }
