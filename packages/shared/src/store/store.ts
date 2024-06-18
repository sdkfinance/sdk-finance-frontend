import Vue from 'vue';
import type { StoreOptions } from 'vuex';
import Vuex from 'vuex';

// import * as modules from './modules/index';

Vue.use(Vuex);

interface RootState {
  version: string;
}

const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0',
  },
  mutations: {},
  actions: {},
  modules: {},
};

export default new Vuex.Store<RootState>(store);

export const useStore = () => store;
