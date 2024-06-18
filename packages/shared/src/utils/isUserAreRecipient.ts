import type { IProfileContact } from '../types/Profile.interface';

type IPlainObject = Record<string, any>;
export const isUserAreRecipient = (transaction: IPlainObject = {}, profileContact: IProfileContact = {} as IProfileContact): boolean => {
  const { email = 'emptyEmail', phoneNumber = 'emptyPhoneNumber' } = transaction?.recipient || {};

  const { email: userEmail = 'emptyUserEmail', phoneNumber: userPhoneNumber = 'emptyUserPhoneNumber' } = profileContact || {};

  const isEmailSame = email === userEmail;
  const isPhoneSame = phoneNumber === userPhoneNumber;

  return isEmailSame || isPhoneSame;
};
