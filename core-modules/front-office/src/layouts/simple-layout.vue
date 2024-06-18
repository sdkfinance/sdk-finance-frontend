<template>
  <div class="simple-layout">
    <router-link
      :to="{ name: routeName, params: { ...($route.params || {}) } }"
      class="simple-layout__back">
      <i class="icon-back-arrow" />
      {{ $t('action.back') }}
    </router-link>
    <main class="simple-layout__main simple-layout__container">
      <transition name="page">
        <router-view />
      </transition>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'simple-layout',
})
export default class SimpleLayout extends Vue {
  @Prop({ type: String, default: 'dashboard' }) readonly backName!: string;

  protected get routeName(): string {
    return this.$route?.params?.backName || this.backName;
  }
}
</script>

<style lang="scss">
.simple-layout {
  @apply p-24 sm:p-45 overflow-x-hidden h-screen;

  &__back {
    @apply flex items-center text-blue-600 static md:absolute;

    i {
      @apply text-xs mr-8 leading-none;
    }
  }

  &__main {
    @apply h-auto;
  }

  &__container {
    @apply general-container;
  }
}
</style>
