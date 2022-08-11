import { IPlainObject } from '@/types/interfaces';
import { IProfileContact } from '@/types/interfaces/Profile.interface';

export const isUserAreRecipient = (transaction: IPlainObject = {}, profileContact: IProfileContact = {} as IProfileContact): boolean => {
  const {
    email = 'emptyEmail',
    phoneNumber = 'emptyPhoneNumber',
  } = transaction?.recipient || {};

  const {
    email: userEmail = 'emptyUserEmail',
    phoneNumber: userPhoneNumber = 'emptyUserPhoneNumber',
  } = profileContact || {};

  const isEmailSame = email === userEmail;
  const isPhoneSame = phoneNumber === userPhoneNumber;

  return (isEmailSame || isPhoneSame);
};
