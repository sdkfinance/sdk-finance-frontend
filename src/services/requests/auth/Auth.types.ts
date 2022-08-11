export interface ILogin {
  login: string;
  password: string;
}

export interface ILoginConfirm {
  login: string;
  otp: string;
}

export interface IPasswordRecoveryConfirmBody {
  login: string;
  newUserPassword: string;
  otp: string;
}

export interface IRegisterUser {
  login: string;
  role?: 'merchant' | 'individual';
  legalType?: 'corporation' | 'individual';
}

export interface IConfirmUserByOtp {
  login: string;
  otp: string;
  password: string;
}
