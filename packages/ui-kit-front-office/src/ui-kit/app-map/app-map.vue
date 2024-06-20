<template>
  <div
    class="app-map"
    :class="wrapperClass">
    <gmap-map
      ref="googleMap"
      class="app-map__component"
      :zoom="zoom"
      :lang="$i18n.locale"
      :center="center"
      :options="{
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        disableDefaultUi: false,
      }">
      <gmap-cluster
        :clickable="true"
        :max-zoom="zoom"
        :styles="clusterStyles"
        :zoom-on-click="true"
        cluster-class="app-map__cluster"
        :animation="2">
        <gmap-marker
          v-for="(item, i) in filteredData"
          :key="`map-marker_${i}`"
          icon="/images/icons/map-marker.svg"
          :position="getCoords(item)"
          :clickable="true"
          @click="openDetails(item)" />
      </gmap-cluster>
    </gmap-map>
  </div>
</template>

<script lang="ts">
import type { IPlainObject } from '@sdk5/shared/types';
import { getProp } from '@sdk5/shared/utils';
import type { googleMaps } from 'gmap-vue';
import { components } from 'gmap-vue';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

declare global {
  interface Window {
    google: {
      maps: googleMaps;
    };
  }
}

const { Cluster: GmapCluster, Marker: GmapMarker, MapLayer: GmapMap } = components;

export default defineComponent({
  name: 'AppMap',
  components: {
    GmapCluster,
    GmapMap,
    GmapMarker,
  },
  props: {
    data: { type: Array as PropType<IPlainObject[]>, default: () => [] },
    wrapperClass: { type: String, default: '' },
    latProperty: { type: String, default: 'latitudes' },
    lngProperty: { type: String, default: 'longitudes' },
  },
  data() {
    const clusterStyles: IPlainObject[] = [
      {
        width: 30,
        height: 30,
        className: 'app-map__cluster-1',
      },
      {
        width: 40,
        height: 40,
        className: 'app-map__cluster-2',
      },
      {
        width: 50,
        height: 50,
        className: 'app-map__cluster-3',
      },
    ];
    const loading: boolean = false;
    const zoom: number = 10;
    const center: IPlainObject = { lat: 0, lng: 0 };

    return {
      center,
      zoom,
      loading,
      clusterStyles,
    };
  },
  computed: {
    filteredData(): IPlainObject[] {
      return this.data.filter((item) => getProp(item, this.latProperty) !== '' && getProp(item, this.lngProperty) !== '');
    },
    googleMap: {
      cache: false,
      get() {
        return this.$refs.googleMap as typeof GmapMap;
      },
      set() {},
    },
  },
  watch: {
    data: [
      {
        handler: 'updateData',
      },
    ],
  },
  mounted(): void {
    this.setMapPosition();
  },
  updated(): void {
    this.setMapPosition();
  },
  methods: {
    getCoords(item: IPlainObject): { lat: number; lng: number } {
      const lat = getProp(item, this.latProperty, 0);
      const lng = getProp(item, this.lngProperty, 0);
      return { lat, lng };
    },
    async setMapPosition(): Promise<void> {
      const map = await this.googleMap?.$mapPromise;

      const bounds = new window.google.maps.LatLngBounds();

      this.filteredData.forEach((item) => bounds.extend(this.getCoords(item)));

      map.fitBounds(bounds, 30);
    },
    updateData(): void {
      this.setMapPosition();
    },
    openDetails<T>(payload: T) {
      this.$emit('open-details', payload);
    },
  },
});
</script>

<style lang="scss">
.app-map {
  @apply h-full w-full;

  &__component {
    @apply h-full w-full;
  }

  &__cluster {
    filter: drop-shadow(0 4px 6px rgb(27 85 233 / 60%));

    @apply flex items-center text-center w-24 h-24 rounded-full bg-primary text-white text-base;

    &-1 {
      @apply h-30 w-30;
    }

    &-2 {
      @apply h-40 w-40;
    }

    &-3 {
      @apply h-50 w-50;
    }
  }
}
</style>
