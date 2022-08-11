export interface IAccountSetting {
   label?: string;
   name: string;
   value: object;
}
export interface IAccountSettingRequest {
   fields: IAccountSetting[];
}

interface ISupportTransaction {
   paymentWay: string;
   transactionType: string;
}

export interface IGateSetting {
   id: string;
   name: string;
   organization: {
      'contract_info': {
         id: string;
         personType: string;
         name: string;
      };
      id: string;
      identificationStatus: string;
      message: string;
      name: string;
      status: string;
      type: string;
   };
   gate: {
      name: string;
   };
   supportedTransactions: ISupportTransaction[];
}

export interface IGateSettingResponse {
   records: IGateSetting[];
}
