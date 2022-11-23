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
          @click="openDetails(item)"/>
      </gmap-cluster>
    </gmap-map>
  </div>
</template>

<script lang="ts">
import { googleMaps } from 'gmap-vue';
import GmapCluster from 'gmap-vue/dist/components/cluster';
import GmapMap from 'gmap-vue/dist/components/map.vue';
import GmapMarker from 'gmap-vue/dist/components/marker';
import {
  Component, Emit, Prop, Ref, Vue, Watch,
} from 'vue-property-decorator';

import { IPlainObject } from '@/types/interfaces';
import { getProp } from '@/utils';

declare global {
  interface Window {
    google: {
      maps: googleMaps;
    };
  }
}

@Component({
  components: {
    GmapCluster,
    GmapMap,
    GmapMarker,
  },
})
export default class AppMap extends Vue {

  @Ref('googleMap') readonly googleMap!: typeof GmapMap;

  @Prop({ type: Array, default: () => [] }) readonly data!: IPlainObject[];

  @Prop({ type: String, default: '' }) readonly wrapperClass!: string;

  @Prop({ type: String, default: 'latitudes' }) readonly latProperty!: string;

  @Prop({ type: String, default: 'longitudes' }) readonly lngProperty!: string;

  protected center: IPlainObject = { lat: 0, lng: 0 };

  protected zoom: number = 10;

  protected loading: boolean = false;

  protected clusterStyles: IPlainObject[] = [{
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

  protected get filteredData(): IPlainObject[] {
    return this.data.filter((item) => getProp(item, this.latProperty) !== ''
        && getProp(item, this.lngProperty) !== '');
  }

  @Watch('data')
  protected updateData(): void {
    this.setMapPosition();
  }

  protected mounted(): void {
    this.setMapPosition();
  }

  protected updated(): void {
    this.setMapPosition();
  }

  @Emit('open-details')
  protected openDetails<T>(payload: T): T {
    return payload;
  }

  protected getCoords(item: IPlainObject): {lat: number; lng: number} {
    const lat = getProp(item, this.latProperty, 0);
    const lng = getProp(item, this.lngProperty, 0);
    return { lat, lng };
  }

  protected async setMapPosition(): Promise<void> {
    const map = await this.googleMap?.$mapPromise;

    const bounds = new window.google.maps.LatLngBounds();

    this.filteredData.forEach((item) => bounds.extend(this.getCoords(item)));

    map.fitBounds(bounds, 30);
  }

}
</script>

<style lang="scss">
.app-map {
  @apply h-full w-full;

  &__component {
    @apply h-full w-full;
  }

  &__cluster {
    filter: drop-shadow(0 4px 6px rgb(27 85 233 / 60%));

    @apply flex items-center text-center w-24 h-24 rounded-full bg-blue-accent text-white text-base;

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
