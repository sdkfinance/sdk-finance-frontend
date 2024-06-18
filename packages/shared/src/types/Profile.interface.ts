type IPlainObject = Record<string, any>;

export interface IProfileContact {
  countryCode: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface IProfile {
  address?: IPlainObject;
  business?: IPlainObject;
  contact?: IProfileContact;
  person?: {
    nameIntl: IPlainObject;
    namePlain: {
      first: string;
      last: string;
    };
    description: string;
  };
  security?: {
    authorizationNotification: {
      email: boolean;
      phone: boolean;
    };
    transactionNotification: {
      email: boolean;
      phone: boolean;
    };
    twoFactorsAuthEnabled: boolean;
  };
  type?: string;
  status?: string;
}
