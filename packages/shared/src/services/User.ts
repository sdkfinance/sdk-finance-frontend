import type { TRole } from '../constants';
import { ROLES } from '../constants';
import { UserDataService } from './UserData.service';

export class User {
  public get role() {
    return UserDataService.role;
  }

  public get isRole(): { [key: string]: boolean } {
    return Object.keys(ROLES).reduce((acc, role) => ({ ...acc, [role]: role === this.role }), {});
  }

  public hasAnyRoles(roles: TRole[]): boolean {
    return roles.some((role) => role === this.role);
  }

  public hasNoRoles(roles: TRole[]): boolean {
    if (!this.role) {
      return false;
    }

    return !roles.includes(this.role);
  }
}
