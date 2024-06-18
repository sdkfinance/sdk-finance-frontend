import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [],
  // @ts-ignore
  scrollBehavior(to: Route, from: Route, savedPosition: Position | void): any {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.params?.viewPosition) {
      return to.params.viewPosition;
    }

    if (to.hash) {
      return {
        selector: to.hash,
      };
    }

    return { x: 0, y: 0 };
  },
});

export default router;
