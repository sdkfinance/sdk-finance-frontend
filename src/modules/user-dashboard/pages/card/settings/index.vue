<template>
  <div class="card-settings">
    <app-form
      ref="form"
      :loading="isLoading"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleForm">
      <app-form-item
        prop="name">
        <app-input
          v-model="form.name"
          label="form.label.card_name"/>
      </app-form-item>
      <app-form-item
        prop="active">
        <div class="card-settings__row">
          {{ $t('form.label.block_card') }}
          <app-switch
            v-model="form.active"
            secondary/>
        </div>
      </app-form-item>
      <app-button class="card-settings__submit">
        {{ $t('action.update') }}
      </app-button>
    </app-form>
  </div>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Ref, Vue, Watch,
} from 'vue-property-decorator';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import { errorNotification, successNotification } from '@/utils';
import { IPlainObject } from '@/types/interfaces';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { SmartCardsRequests } from '@/services/requests/smart-cards/SmartCardsRequests';
import { ISmartCardRecord, ISmartCardUpdatePayload } from '@/services/requests/smart-cards/SmartCards.types';
import AppModal from '@/components/ui-kit/modals/app-modal.vue';
import AppInfoModal, { InfoModalTypes } from '@/components/ui-kit/modals/app-info-modal.vue';

@Component({
  components: {
    AppInfoModal,
    AppModal,
    AppSwitch,
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class CardSettings extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Ref('terminateModal') readonly terminateModal!: AppModal;

  @Prop({ type: Object, default: () => ({}) }) readonly card!: ISmartCardRecord

  protected isLoading: boolean = false;

  protected infoModalTypes = InfoModalTypes;

  protected cardId: string = this.$route.params?.cardId;

  protected form: ISmartCardUpdatePayload = {
    name: '',
    active: true,
  };

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
  };

  @Watch('card', { immediate: true })
  protected setFormData(card: IPlainObject): void {
    this.form.name = card.name;
    this.form.active = !card.active;
  }

  @Emit('updated-settings')
  protected updatedSettings(): boolean {
    return true;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    const { name, active } = this.form;

    this.isLoading = true;
    const { error } = await SmartCardsRequests.updateUserCard(this.card.cardNumber, {
      name,
      active: !active,
    });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }
    successNotification();
    this.updatedSettings();
  }

}
</script>

<style lang="scss">
.card-settings {
  @apply w-full max-w-400;

  &__row {
    @apply w-full flex justify-between items-center font-medium text-base text-gray-500;
  }

  &__submit {
    @apply block w-full sm:max-w-300 ml-auto mr-auto mt-50;
  }
}

</style>
