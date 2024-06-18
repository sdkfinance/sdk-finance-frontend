<template>
  <div class="page-subtitle">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'page-subtitle',
})
export default class PageSubtitle extends Vue {}
</script>

<style lang="scss">
.page-subtitle {
  @apply mb-32 text-xl text-gray-500 flex items-center;

  .daterange-container {
    @apply ml-12;
  }
}
</style>
