<template>
  <div
    class="app-table-info"
    :class="{'app-table-info--summary': isSummary}">
    <div class="app-table-info__card">
      <app-operation-image
        :image="image || iconPlaceholder"
        :background-color="backgroundColor"
        :has-error="hasError"/>

      <div class="app-table-info__details">
        <p class="app-table-info__details-title">
          <slot name="title">
            {{ title }}
          </slot>
        </p>

        <div class="app-table-info__details-info">
          <slot name="description">
            <span
              class="app-table-info__details-info-status"
              :class="[
                {'app-table-info__details-info-status--error': hasError},
                hasError ? 'inline' : 'hidden md:inline'
              ]">
              {{ status }}
            </span>
            <span class="hidden md:inline">
              · {{ formatTimeMethod(time) }} ·
            </span>
            <span :class="{'hidden md:inline': hasError}">{{ categoryName }}</span>
          </slot>
        </div>
      </div>
    </div>

    <slot name="mobile-info"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { BADGE_STATUSES } from '@/constants/badge-statuses';
import { formatTime } from '@/utils';
import AppOperationImage from '@/components/ui-kit/app-operation-image.vue';

const iconPlaceholder = require('@/assets/icons/empty-category.svg');

@Component({
  components: {
    AppOperationImage,
  },
})
export default class AppTableInfo extends Vue {

  @Prop({ default: '', type: String }) readonly title!: string;

  @Prop({ type: String, default: 'default' }) readonly status!: keyof typeof BADGE_STATUSES;

  @Prop({ default: '', type: [String, Date] }) readonly time!: string;

  @Prop({ default: '', type: String }) readonly categoryName!: string;

  @Prop({ default: '', type: String }) readonly image!: string;

  @Prop({ default: '', type: String }) readonly alt!: string;

  @Prop({ default: false, type: Boolean }) readonly hasError!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isSummary!: boolean;

  @Prop({ default: true, type: Boolean }) readonly hasShadow!: boolean;

  @Prop({ type: String, default: '#0D2C50' }) readonly backgroundColor!: string;

  protected iconPlaceholder = iconPlaceholder;

  protected formatTimeMethod(value: string): string {
    return formatTime(value);
  }

}
</script>

<style lang="scss">
.app-table-info {
  @apply flex flex-col;

  &--summary {
    @apply shadow-card md:shadow-none p-20 md:p-0 rounded-lg;
  }

  &__card {
    @apply flex;

    .app-table-info__details {
      @apply flex flex-col justify-between leading-none py-2;

      &-title {
        @apply text-gray-500 font-medium md:mb-2 text-base md:text-lg;
      }

      &-info {
        @apply text-blue-500 font-medium leading-none text-sm md:text-base;

        &-status {
          @apply capitalize;

          &--error {
            @apply text-red-main;
          }
        }
      }
    }
  }
}
</style>
