<template>
  <div class="info-block">
    <div class="info-block__wrapper">
      <div class="info-block__column">
        <div class="info-block__label">
          {{ $t('form.label.start_date') }}
        </div>
        <div class="info-block__value">
          {{ beginDate }}
        </div>
      </div>

      <div class="info-block__column">
        <div class="info-block__label">
          {{ $t('form.label.end_date') }}
        </div>
        <div class="info-block__value">
          {{ endDate }}
        </div>
      </div>

      <div class="info-block__column">
        <div class="info-block__label">
          {{ $t('form.label.direction') }}
        </div>
        <div class="info-block__value">
          {{ data.feeDirection }}
        </div>
      </div>

      <div class="info-block__column">
        <div class="info-block__label">
          {{ $t('form.label.status') }}
        </div>
        <div class="info-block__value">
          {{ status }}
        </div>
      </div>
    </div>

    <app-button
      secondary
      size="small"
      @click.prevent="onEdit(data)">
      {{ $t('action.edit') }}
    </app-button>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Emit,
} from 'vue-property-decorator';
import { LocaleMessage } from 'vue-i18n';
import AppButton from '@/components/ui-framework/app-button.vue';
import { getDefaultDate } from '@/utils';
import { ICommissionRule } from '@/services/requests/contracts/Commissions.types';

@Component({
  components: {
    AppButton,
  },
})
export default class AppInfoBlock extends Vue {

  @Prop({ type: Object, default: () => ([]) }) readonly data!: ICommissionRule;

  @Emit('edit')
  onEdit<T>(data: T): T {
    return data;
  }

  protected get beginDate(): string {
    return getDefaultDate(this.data.beginDate, 'date');
  }

  protected get endDate(): string {
    return getDefaultDate(this.data.endDate, 'date');
  }

  protected get status(): LocaleMessage {
    return this.data.active
      ? this.$t('form.label.active')
      : this.$t('form.label.inactive');
  }

}
</script>

<style lang="scss">
.info-block {
  @apply flex justify-between bg-blue-200 py-15 px-16 rounded-sm;

  &__wrapper {
    @apply flex flex-row;
  }

  &__column {
    @apply mr-36;
  }

  &__label {
    @apply text-sm text-blue-500;
  }

  &__value {
    @apply text-sm font-normal;
  }
}
</style>
