import { TTxType } from '@/services/requests/contracts/Commissions.types';
import { IDynamicField } from '@/types/interfaces';
import { IWalletRecord } from '@/services/requests/coins/Wallets.types';
import { ICurrency } from '@/services/requests/currencies/Currency.types';

export interface IPaymentProviderRecord {
    gateProvider: {
        id: string;
        name: string;
        gate: {
            name: string;
        };
    };
    way: string;
    icon?: string;
}

export interface ICalculateCommissionBody {
    gateProviderId: string;
    serial: string;
    amount: number;
    txType: TTxType;
    payerId?: string;
}

export interface ICalculateCommissionRecord {
    status: string;
    message: string;
    sourceAmount: number;
    amountToSend: number;
    commissionAmount: number;
    currency: ICurrency;
}

export interface IGateCreateTransactionBody {
    coin: string;
    amount: number;
    type: TTxType;
    deviceId?: string;
    deviceOrderId?: string;
    method: {
        gateProviderId: string;
        way: string;
    };
    description?: string;
}

export interface IGateTransactionRecord {
    id: string;
    orderId: number;
    deviceId: string;
    deviceOrderId: string;
    type: string;
    status: string;
    errorCode: string;
    coin: IWalletRecord;
    paymentMethod: IPaymentProviderRecord;
    sourceAmount: number;
    amountToSend: number;
    finalAmount: number;
    processId: string;
    payerData: {};
}

export interface IGatePayerField {
    name: string;
    value: any;
}

export interface IGatePayerFields {
    name: string;
    fields: IDynamicField[];
}

export interface IGateSubmitPayerBody {
    optionName: string;
    fields: IGatePayerField[];
}

export interface IPaymentProviderBody {
    txType: TTxType;
    serial: string;
}

export type IPaymentProvidersResponse = { records: ICalculateCommissionRecord[] }
export type IGateMethodsResponse = { records: IPaymentProviderRecord[] }
export type IGateIGatePayerFieldsResponse = { options: IGatePayerFields[] }
export type IGateTransactionResponse = { transaction: IGateTransactionRecord }
