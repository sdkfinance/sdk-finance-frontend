import type { IProfile } from './Profile.interface';

type IPlainObject = Record<string, any>;

interface IUserRole {
  code: string;
  permissions: string[];
  bundleKey: string;
}

export interface IUserProfile extends IProfile {
  additional?: IPlainObject;
  role?: [IUserRole];
}
