import type { IRouteConfig } from '@sdk5/shared/types';

import { MY_ACCOUNTS_AND_BALANCES } from '../../my-accounts-and-balances/routes';

export const WALLETS: IRouteConfig = {
  path: '/dashboard/accounts',
  redirect: MY_ACCOUNTS_AND_BALANCES.path,
};
