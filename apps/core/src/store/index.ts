import store from '@sdk5/shared/store';

import * as modules from './modules';

Object.entries(modules).forEach(([key, module]) => {
  store.registerModule(key, module);
});

export default store;
