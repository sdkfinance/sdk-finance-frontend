import Vue from 'vue';
import * as VueGoogleMaps from 'gmap-vue';

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAP_API_KEY,
    v: '3.26',
  },
  installComponents: false,
});
