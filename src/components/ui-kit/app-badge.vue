<template>
  <span
    :class="classList">
    {{ translatedLabel }}
  </span>
</template>

<script lang="ts">
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';
import { LocaleMessage } from 'vue-i18n';
import { BADGE_STATUSES } from '@/constants/badge-statuses';

const CLASS_LIST = {
  success: [
    BADGE_STATUSES.processed,
    BADGE_STATUSES.approved,
    BADGE_STATUSES.active,
    BADGE_STATUSES.activated,
    BADGE_STATUSES.new,
    BADGE_STATUSES.authorized,
    BADGE_STATUSES.default,
    BADGE_STATUSES.done,
  ],
  warning: [
    BADGE_STATUSES.pending,
    BADGE_STATUSES.stopped,
    BADGE_STATUSES.deactivate,
    BADGE_STATUSES.deactivated,
    BADGE_STATUSES.inactive,
    BADGE_STATUSES.none,
  ],
  danger: [
    BADGE_STATUSES.rejected,
    BADGE_STATUSES.expired,
    BADGE_STATUSES.declined,
    BADGE_STATUSES.banned,
  ],
};

@Component
export default class AppBadge extends Vue {

  @Prop({ type: String, default: '' }) readonly label!: string;

  @Prop({ type: String, default: 'default' }) readonly status!: keyof typeof BADGE_STATUSES;

  @Prop({ type: String, default: 'text-sm' }) readonly fontClass!: string;

  @Prop({ type: Boolean, default: false }) readonly isBorderless!: boolean;

  @Prop({ type: Boolean, default: false }) readonly isBackgroundTransparent!: boolean;

  protected get translatedLabel(): LocaleMessage {
    return this.label ? this.$t(this.label) : this.$t(`entity.badge_status.${this.badgeStatus}`);
  }

  protected get badgeStatus(): string {
    return BADGE_STATUSES[this.status!] || BADGE_STATUSES.default;
  }

  protected get classList(): string[] {
    const status = this.status.toLowerCase();
    const [type] = Object.entries(CLASS_LIST).find(([, statuses]) => statuses.includes(status)) || [];

    return [
      'badge',
      `badge--${type}`,
      this.isBorderless ? 'badge--borderless' : '',
      this.isBackgroundTransparent ? 'badge--background-transparent' : '',
      this.fontClass,
    ];
  }

}
</script>

<style lang="scss">
.badge {
  @apply text-sm font-semibold border border-transparent px-12 py-2 rounded-sm w-fit;

  &--success {
    @apply text-green-main bg-green-tint border-green-main;
  }

  &--danger {
    @apply bg-red-tint text-red-main border-red-main;
  }

  &--warning {
    @apply bg-orange-tint text-orange-main border-orange-main;
  }

  &--borderless {
    @apply border-transparent #{!important};
  }

  &--background-transparent {
    @apply bg-transparent #{!important};
  }
}
</style>
