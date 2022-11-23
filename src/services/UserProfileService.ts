import { TRole } from '@/constants/roles';
import { User } from '@/services/User';
import store from '@/store';

class UserProfileService extends User {

  public get role(): TRole {
    return store.getters['UserProfile/role'];
  }

}

export const UserProfileInstance = new UserProfileService();
