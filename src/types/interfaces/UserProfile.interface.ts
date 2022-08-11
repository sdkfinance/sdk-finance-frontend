import { IProfile } from '@/types/interfaces/Profile.interface';
import { IPlainObject } from '@/types/interfaces/PlainObject.interface';

interface IUserRole {
  code: string;
  permissions: string[];
  bundleKey: string;
}

export interface IUserProfile extends IProfile {
  additional?: IPlainObject;
  role?: [IUserRole];
}
