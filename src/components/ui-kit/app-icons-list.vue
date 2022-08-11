<template>
  <div class="grid md:grid-cols-6 2xl:grid-cols-9 gap-20">
    <div
      v-for="(icon, i) in icons"
      :key="i"
      class="flex flex-col items-center justify-center px-5 py-10 text-blue-600 border border-opacity-45 border-blue-600 rounded-lg text-center">
      <i :class="`icon-${icon.properties.name}`"/>
      <label class="text-gray-500 mt-5">icon-{{ icon.properties.name }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import icons from '@/assets/icomoon/selection.json';
import { IPlainObject } from '@/types/interfaces';

@Component
export default class AppIconsList extends Vue {

  protected icons: IPlainObject[] = icons?.icons || [];

}

</script>
