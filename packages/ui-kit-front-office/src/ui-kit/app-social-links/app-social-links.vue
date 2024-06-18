<template>
  <div class="app-socials">
    <a
      v-for="[type, url] in socialList"
      :key="type"
      :href="url">
      <img
        :src="`/images/socials/${type}.svg`"
        alt="" />
    </a>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ISocialLinks } from './types';

export default defineComponent({
  name: 'AppSocialLinks',
  props: {
    links: { type: Object as PropType<ISocialLinks>, required: true },
  },
  computed: {
    socialList() {
      return Object.entries(this.links);
    },
  },
});
</script>

<style lang="scss">
.app-socials {
  @apply inline-flex items-center;

  a {
    @apply flex items-center ml-20;
  }
}
</style>
