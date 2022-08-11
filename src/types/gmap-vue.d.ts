declare module 'gmap-vue' {
    import { PluginFunction } from 'vue';

    export const install: PluginFunction<{}>;

    export type googleMaps = typeof google.maps
    /// <reference types="@types/googlemaps" />
}
declare module 'gmap-vue/*';
declare module 'gmap-vue/dist/components/marker';
declare module 'gmap-vue/dist/components/cluster';
