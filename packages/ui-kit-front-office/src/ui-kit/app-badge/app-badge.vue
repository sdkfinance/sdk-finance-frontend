<template>
  <span :class="classList">
    {{ translatedLabel }}
  </span>
</template>

<script lang="ts">
import { BADGE_STATUSES, type TBadgeStatus } from '@sdk5/shared/constants';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

const APP_BADGE_DISPLAY_STATUS = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  default: 'default',
} as const;

const CLASS_LIST = {
  [APP_BADGE_DISPLAY_STATUS.success]: [
    BADGE_STATUSES.processed,
    BADGE_STATUSES.approved,
    BADGE_STATUSES.active,
    BADGE_STATUSES.activated,
    BADGE_STATUSES.new,
    BADGE_STATUSES.authorized,
    BADGE_STATUSES.default,
    BADGE_STATUSES.done,
    BADGE_STATUSES.reconciliated,
  ],
  [APP_BADGE_DISPLAY_STATUS.warning]: [
    BADGE_STATUSES.pending,
    BADGE_STATUSES.stopped,
    BADGE_STATUSES.deactivate,
    BADGE_STATUSES.deactivated,
    BADGE_STATUSES.inactive,
    BADGE_STATUSES.none,
    BADGE_STATUSES.suspended,
    BADGE_STATUSES.limited,
    BADGE_STATUSES.inprogress,
  ],
  [APP_BADGE_DISPLAY_STATUS.danger]: [
    BADGE_STATUSES.rejected,
    BADGE_STATUSES.expired,
    BADGE_STATUSES.declined,
    BADGE_STATUSES.banned,
    BADGE_STATUSES.error,
    BADGE_STATUSES.terminated,
    BADGE_STATUSES.unsupported,
    BADGE_STATUSES.warning,
  ],
};

export default defineComponent({
  name: 'AppBadge',
  props: {
    label: { type: String, default: '' },
    status: { type: String as PropType<TBadgeStatus | (string & {})>, default: BADGE_STATUSES.default },
    fontClass: { type: String, default: 'text-sm' },
    isBorderless: { type: Boolean, default: false },
    isBackgroundTransparent: { type: Boolean, default: false },
  },
  computed: {
    translatedLabel(): string {
      const messageKey = this.label ? this.label : `entity.badge_status.${this.badgeStatus}`;
      return this.$t(messageKey).toString();
    },
    badgeStatus(): string {
      return BADGE_STATUSES[this.status as TBadgeStatus] || BADGE_STATUSES.default;
    },
    classList(): string[] {
      const status = this.status.toLowerCase();
      const [type] = Object.entries(CLASS_LIST).find(([, statuses]) => statuses.includes(status)) || [];

      return [
        'badge',
        `badge--${type ?? APP_BADGE_DISPLAY_STATUS.default}`,
        this.isBorderless ? 'badge--borderless' : '',
        this.isBackgroundTransparent ? 'badge--background-transparent' : '',
        this.fontClass,
      ];
    },
  },
});
</script>

<style lang="scss">
.badge {
  @apply text-sm font-semibold border border-transparent px-12 py-2 rounded-sm w-fit;

  &--success,
  &--warning,
  &--danger,
  &--default {
    @apply font-normal text-gray-500 inline-flex items-center justify-start gap-x-[0.25rem] bg-transparent border-0 w-auto;
    @apply before:w-[0.375rem] before:h-[0.375rem] before:rounded-full;
  }

  &--success {
    @apply before:bg-green-main;
  }

  &--danger {
    @apply before:bg-red-warning;
  }

  &--warning {
    @apply before:bg-orange-main;
  }

  &--default {
    @apply before:bg-blue-400;
  }

  &--borderless {
    @apply border-transparent #{!important};
  }

  &--background-transparent {
    @apply bg-transparent #{!important};
  }
}
</style>
