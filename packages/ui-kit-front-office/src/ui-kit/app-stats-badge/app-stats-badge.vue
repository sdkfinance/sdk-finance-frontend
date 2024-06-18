<template>
  <div class="stats-badge">
    <div class="stats-badge__icon">
      <i :class="iconClassList" />
    </div>
    <div class="stats-badge__info">
      <div class="stats-title">
        <slot name="title" />
      </div>
      <div class="stats-subtitle">
        <slot name="subtitle" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppStatsBadge',
  props: {
    icon: { type: String, default: 'icon-users-alt' },
  },
  computed: {
    iconClassList(): string[] {
      return ['stats-icon', this.icon];
    },
  },
});
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
