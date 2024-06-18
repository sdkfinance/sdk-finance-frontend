import VueGoogleMaps from 'gmap-vue';
import Vue from 'vue';

Vue.use(VueGoogleMaps, {
  load: {
    key: import.meta.env.VUE_APP_GOOGLE_MAP_API_KEY,
    v: '3.50',
  },
  installComponents: false,
});
