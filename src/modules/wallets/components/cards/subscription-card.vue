<template>
  <template-transfer-card
    :title="data.name"
    :index="index">
    <template #icon>
      <i class="icon-subscription"/>
    </template>
    <div class="subscription-card__content">
      <strong>{{ data.templateDto.amount }}</strong> {{ getType() }}
    </div>
    <template #footer-content>
      <div class="subscription-card__date">
        <i class="subscription-card__icon icon-time-circle"/> {{ getDate() }}
      </div>
    </template>
    <template #actions>
      <button
        v-if="isActive"
        class="template-card__button template-card__button--primary"
        @click="$emit('stop', data.id)">
        {{ $t('action.stop') }}
      </button>
      <button
        v-else
        class="template-card__button template-card__button--primary"
        @click="$emit('start', data.id)">
        {{ $t('action.start') }}
      </button>
      <button
        class="template-card__button template-card__button--danger"
        @click="$emit('delete', data.id)">
        {{ $t('action.delete') }}
      </button>
    </template>
  </template-transfer-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import dayjs from 'dayjs';
import { LocaleMessage } from 'vue-i18n';
import TemplateTransferCard from '@/modules/wallets/components/cards/template-transfer-card.vue';
import {
  ISubscriptionRecord,
} from '@/services/requests/subscriptions/Subscriptions.types';

@Component({
  components: {
    TemplateTransferCard,
  },
})
export default class SubscriptionCard extends Vue {

  @Prop({ type: Number, required: true }) readonly index!: number;

  @Prop({ type: Object, required: true }) readonly data!: ISubscriptionRecord;

  protected get isActive(): boolean {
    return this.data.subscriptionStatus === 'ACTIVE';
  }

  protected getType(): LocaleMessage {
    const { type } = this.data;
    return this.$t(`entity.subscription_types.card.${type.toLowerCase()}`);
  }

  protected getDate(): string | LocaleMessage {
    const { subscriptionStatus: status, expirationConfig: { expirationDate: date } } = this.data;
    if (status === 'STOPPED') {
      return this.$t('pages.wallets.inactive');
    }
    if (date) {
      const endDate = dayjs(date).format('YYYY.MM.DD');
      return `${this.$t('pages.wallets.ends_on')} ${endDate}`;
    }
    return this.$t('pages.wallets.no_end_date');
  }

}
</script>

<style lang="scss">
.subscription-card {
  &__content {
    font-size: 14px;
    font-weight: 500;

    strong {
      font-size: 18px;
      font-weight: 600;
    }
  }

  &__date {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    color: #adb3bc;

    .subscription-card__icon {
      font-size: 8px;
      margin-right: 6px;
    }
  }
}
</style>
