import type { TRole } from '../constants';
import store from '../store';
import { User } from './User';

class UserProfileService extends User {
  public get role(): TRole {
    return store.getters['UserProfile/role'];
  }
}

export const UserProfileInstance = new UserProfileService();
