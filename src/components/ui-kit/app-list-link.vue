<template>
  <component
    :is="tag"
    :to="to"
    class="app-list-link">
    <div class="app-list-link__icon">
      <span :class="icon"/>
    </div>
    <div class="app-list-link__title">
      {{ $t(title) }}
    </div>
    <div class="app-list-link__arrow icon-arrow-right"/>
  </component>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

@Component
export default class AppListLink extends Vue {

  @Prop({ type: [Object, String], required: true }) readonly to!: RawLocation;

  @Prop({ type: String, required: true }) readonly icon!: string;

  @Prop({ type: String, required: true }) readonly title!: string;

  @Prop({ type: String, default: 'router-link' }) readonly tag!: string;

}
</script>

<style lang="scss">
.app-list-link {
  box-shadow: 0 2px 12px rgb(161 182 198 / 20%);

  @apply rounded-lg bg-white px-24 py-20 flex items-center mb-16;

  &__icon {
    @apply bg-blue-200 rounded-full flex justify-center items-center w-40 h-40 mr-24 text-11 text-blue-600 flex-shrink-0;
  }

  &__title {
    @apply text-gray-500 text-lg;
  }

  &__arrow {
    @apply ml-auto text-blue-600 text-xs;
  }
}
</style>
