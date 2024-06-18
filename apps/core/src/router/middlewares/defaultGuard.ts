import type { RouteMiddleware } from '@sdk5/shared/types';

export const defaultGuard: RouteMiddleware = ({ to, next, store, abort }) => {
  const { disableGuard } = to?.meta || {};

  if (disableGuard || store.getters!['UserData/token']) {
    return next();
  }

  return abort({ name: 'entrance', query: to.query });
};
