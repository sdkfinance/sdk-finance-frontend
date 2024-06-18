declare module 'gmap-vue' {
  import type { PluginFunction } from 'vue';

  export const install: PluginFunction<{}>;

  export const components: any;

  export type googleMaps = typeof google.maps;
  /// <reference types="@types/google.maps" />
}
declare module 'gmap-vue/*';
declare module 'gmap-vue/dist/components/marker';
declare module 'gmap-vue/dist/components/cluster';
