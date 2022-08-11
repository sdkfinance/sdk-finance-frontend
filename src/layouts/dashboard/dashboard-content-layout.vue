<template>
  <div class="dashboard-content">
    <div class="dashboard-content__header">
      <div class="dashboard-content__title">
        <router-link
          v-if="backName && !isBackHidden"
          class="dashboard-content__back"
          :to="{name: backName, params: {...($route.params || {})}}">
          <button class="icon-back-arrow"/>
        </router-link>
        <slot name="title"/>
      </div>
      <div class="dashboard-content__actions">
        <slot name="actions"/>
      </div>
    </div>
    <slot/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DashboardContentLayout extends Vue {

  @Prop({ type: Boolean, default: false }) readonly isBackHidden!: boolean;

  protected get backName(): string | boolean {
    return this.$route?.meta?.layout?.props?.backName || false;
  }

}
</script>

<style lang="scss">
.dashboard-content {
  @apply flex flex-col flex-grow pt-65 general-container--wide px-72 pb-20 box-content;

  &__header {
    @apply flex items-center justify-between mb-16;
  }

  &__title {
    @apply text-gray-500 text-36 font-semibold flex items-center;
  }

  &__back {
    @apply flex items-center;

    button {
      @apply text-blue-600 text-xs mr-13 leading-none;
    }
  }

  &__actions {
    .btn + .btn {
      @apply ml-16;
    }
  }
}
</style>
