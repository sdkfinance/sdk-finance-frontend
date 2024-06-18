import type { TRole } from '../constants';
import store from '../store';
import { User } from './User';

class UserService extends User {
  public get role(): TRole {
    return store.getters['UserData/role'];
  }

  public get organizationId(): string {
    return store.getters['Profile/organizationId'];
  }
}

export const UserInstance = new UserService();
