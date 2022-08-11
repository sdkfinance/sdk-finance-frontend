<template>
  <template-transfer-card
    :title="templateData.name"
    :index="index">
    <template #icon>
      <i class="icon-template"/>
    </template>
    <template #footer-content>
      {{ templateData.amount }} {{ templateData.senderCoin.issuer.currency }}
    </template>
    <template #actions>
      <button
        class="template-card__button template-card__button--primary"
        @click="repeatTransfer">
        {{ $t('action.repeat') }}
      </button>
      <button
        class="template-card__button template-card__button--primary"
        @click="editTransfer">
        {{ $t('action.edit') }}
      </button>
    </template>
  </template-transfer-card>
</template>

<script lang="ts">
import {
  Component, Prop, Emit, Vue,
} from 'vue-property-decorator';
import TemplateTransferCard from '@/modules/wallets/components/cards/template-transfer-card.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { ITransactionsRecord } from '@/services/requests/transactions/Transactions.types';

@Component({
  components: {
    TemplateTransferCard,
    AppButton,
  },
})
export default class TemplateCard extends Vue {

  @Prop({ type: Object, required: true }) readonly templateData!: ITransactionsRecord;

  @Prop({ type: Number, required: true }) readonly index!: number;

  @Emit('repeat')
  repeatTransfer(): ITransactionsRecord {
    return this.templateData;
  }

  @Emit('edit')
  editTransfer(): ITransactionsRecord {
    return this.templateData;
  }

}
</script>
