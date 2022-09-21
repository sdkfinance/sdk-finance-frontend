import { routeMiddleware } from '@/router/middlewares/types/routeMiddleware';

export const defaultGuard: routeMiddleware = ({
  to, next, store, abort,
}) => {
  const { disableGuard } = to?.meta || {};

  if (disableGuard || store.getters!['UserData/token']) {
    return next();
  }

  return abort({ name: 'entrance', query: to.query });

};
