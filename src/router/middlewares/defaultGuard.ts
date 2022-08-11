import { routeMiddleware } from '@/router/middlewares/types/routeMiddleware';

export const defaultGuard: routeMiddleware = ({ to, next, store }) => {
  const { disableGuard } = to?.meta || {};

  if (disableGuard || store.getters!['UserData/token']) {
    return next();
  }

  return next({ name: 'entrance', query: to.query });
};
