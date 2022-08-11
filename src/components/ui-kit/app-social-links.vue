<template>
  <div class="app-socials">
    <a
      v-for="([type, url]) in socialList"
      :key="type"
      :href="url">
      <img
        :src="`/images/socials/${type}.svg`"
        alt="">
    </a>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

export interface ISocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

@Component
export default class AppSocialLinks extends Vue {

  @Prop({ type: Object, required: true }) readonly links!: ISocialLinks;

  protected get socialList() {
    return Object.entries(this.links);
  }

}
</script>

<style lang="scss">
.app-socials {
  @apply inline-flex items-center;

  a {
    @apply flex items-center ml-20 ;
  }
}
</style>
