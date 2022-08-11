<template>
  <div class="stats-badge">
    <div class="stats-badge__icon">
      <i :class="iconClassList"/>
    </div>
    <div class="stats-badge__info">
      <div class="stats-title">
        <slot name="title"/>
      </div>
      <div class="stats-subtitle">
        <slot name="subtitle"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';

@Component
export default class AppStatsBadge extends Vue {

  @Prop({ type: String, default: 'icon-users-alt' }) readonly icon!: string;

  protected get iconClassList(): string[] {
    return [
      'stats-icon',
      this.icon,
    ];
  }

}
</script>

<style lang="scss">
  .stats-badge {
    @apply flex px-10 py-16 border rounded-lg border-blue-400 max-w-268;

    &__icon {
      @apply flex items-center justify-center text-blue-600 px-18;
    }
  }

  .stats-title {
    @apply mb-4;
  }

  .stats-title,
  .stats-subtitle {
    @apply text-sm text-gray-500;
  }
</style>
