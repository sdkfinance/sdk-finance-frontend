<template>
  <app-step-controller
    ref="issueCardFormStepController"
    class="issue-card-form-container"
    back-name=""
    :total-steps="2"
    :is-close-visible="false"
    :is-back-visible="false">
    <template #default="{ currentStep }">
      <app-form-wrapper class="issue-card-form">
        <app-form
          :model="form"
          :loading="isLoading"
          @submit.native.prevent>
          <template v-if="currentStep === 1">
            <div class="issue-card-form__products-list">
              <template v-for="(product, index) of displayAvailableCardProducts">
                <card-product-item
                  :key="index"
                  :image-path="product.imagePath"
                  :product-title="product.productTitle"
                  :product-description="product.productDescription"
                  :is-selected="product.id === form.selectedCardProductItemId"
                  :product-id="product.id"
                  @select-product="selectCardProductItemHandler" />
              </template>
            </div>
          </template>
          <card-design-selection
            v-else
            v-model="form.cardName" />

          <div class="issue-card-form__action">
            <app-button
              full-width
              type="primary"
              size="large"
              :disabled="currentStep === 1 ? form.selectedCardProductItemId === null : !form.cardName.trim()"
              @click="actionButtonClickHandler">
              {{ currentStep === 1 ? $t('action.continue') : $t('action.process') }}
            </app-button>
          </div>
        </app-form>
      </app-form-wrapper>
    </template>
  </app-step-controller>
</template>

<script lang="ts">
import type { IGateSetting, IGateSubmitPayerBody, TGateProduct, TIssueCardPurchasesPayload } from '@sdk5/shared/requests';
import { GateProductsRequests, GateProviderRequests, GateRequests, IssueCardRequests } from '@sdk5/shared/requests';
import type { IServerError } from '@sdk5/shared/types';
import { errorNotification } from '@sdk5/shared/utils';
import { AppButton, AppForm, AppFormWrapper, AppStepController } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator';

import CardDesignSelection from './card-design-selection.vue';
import CardProductItem from './card-product-item.vue';

type TCardProductItem = {
  imagePath: string;
  productTitle: string;
  productDescription: string;
  id: string;
};

const MARQETA_GATE_PROVIDER_NAME = 'Marqeta Card Issuing';
const MARQETA_GATE_NAME = 'Marqeta Card Issuing';

const COMPONENTS = {
  CardDesignSelection,
  AppButton,
  CardProductItem,
  AppStepController,
  AppFormWrapper,
  AppForm,
} as const;

@Component({
  components: COMPONENTS,
})
export default class IssueCardForm extends Vue {
  static components: typeof COMPONENTS;

  @Ref('issueCardFormStepController') readonly issueCardFormStepController!: typeof AppStepController;

  @Prop({ type: String, required: true }) readonly serial!: string;

  protected isLoading = false;

  protected availableCardProducts: TGateProduct[] = [];

  protected gateProviders: IGateSetting[] = [];

  protected form = {
    selectedCardProductItemId: null as string | null,
    cardName: '',
  };

  protected get cardIssuingProviderId() {
    const cardIssuingProvider = this.gateProviders.find(
      (provider) =>
        provider.name === MARQETA_GATE_PROVIDER_NAME &&
        provider.gate.name === MARQETA_GATE_NAME &&
        provider.supportedTransactions.findIndex(
          (transactionType) => transactionType.paymentWay === 'CARD_ISSUING' && transactionType.transactionType === 'ISSUE_CARD',
        ) !== -1,
    );
    return cardIssuingProvider?.id ?? null;
  }

  protected get displayAvailableCardProducts(): TCardProductItem[] {
    return this.availableCardProducts.map((availableCardProduct) => {
      const { id, name, nameBundleKey, description, descriptionBundleKey, iconBundleKey, icon } = availableCardProduct;
      return {
        id,
        imagePath: iconBundleKey ? this.$t(iconBundleKey).toString() : icon ?? '',
        productDescription: descriptionBundleKey ? this.$t(descriptionBundleKey).toString() : description ?? '',
        productTitle: nameBundleKey ? this.$t(nameBundleKey).toString() : name ?? '',
      };
    });
  }

  protected selectCardProductItemHandler(productId: string): void {
    this.form.selectedCardProductItemId = productId;
  }

  protected async fetchGateProviders() {
    this.isLoading = true;
    const { response, error } = await GateProviderRequests.getProviders();
    this.isLoading = false;

    if (error !== null) {
      errorNotification(error);
      return;
    }

    this.gateProviders = response?.records ?? [];
  }

  protected async fetchAvailableCardProducts(gateProviderId: string) {
    this.isLoading = true;
    const { response, error } = await GateProductsRequests.getAvailableProviderProducts(gateProviderId);
    this.isLoading = false;

    if (error !== null) {
      errorNotification(error);
      return;
    }

    this.availableCardProducts = response.records ?? [];
  }

  protected async actionButtonClickHandler(): Promise<void> {
    if (this.issueCardFormStepController.currentStep === 1) {
      this.issueCardFormStepController.nextStep();
      this.emitStepChange(2);
      return;
    }

    if (this.form.selectedCardProductItemId === null || !this.form.cardName.trim()) {
      return;
    }

    this.processCardIssuing({
      cardName: this.form.cardName,
      cardProductId: this.form.selectedCardProductItemId,
    });
  }

  protected async processCardIssuing(options: { cardProductId: string; cardName: string }) {
    this.isLoading = true;
    const { cardName, cardProductId } = options;
    const createIssueCardPurchaseResponse = await this.createIssueCardPurchase(cardProductId);

    if (createIssueCardPurchaseResponse === null) {
      this.isLoading = false;
      return;
    }

    const { id: transactionId } = createIssueCardPurchaseResponse;
    const prepareTransactionResponse = await this.prepareIssueCardTransaction(transactionId, cardName);
    this.isLoading = false;

    if (prepareTransactionResponse === null) {
      return;
    }

    if (prepareTransactionResponse.errorMessage) {
      errorNotification({ code: prepareTransactionResponse.errorMessage, errors: [] } as unknown as IServerError);
    }

    this.emitSubmittedEvent(prepareTransactionResponse.status === 'processed');
  }

  protected async createIssueCardPurchase(selectedProductId: string) {
    const payload = {
      description: 'Issue Card',
      productId: selectedProductId,
      serial: this.serial,
    } as TIssueCardPurchasesPayload;
    const { response, error } = await IssueCardRequests.createIssueCardPurchase(payload);

    if (error !== null) {
      errorNotification(error);
      return null;
    }

    return response;
  }

  protected async prepareIssueCardTransaction(transactionId: string, cardName: string) {
    const payload = {
      optionName: 'default',
      fields: {
        cardName,
      },
    } as IGateSubmitPayerBody;
    const { response, error } = await GateRequests.prepareTransaction(transactionId, payload);

    if (error !== null) {
      errorNotification(error);
      return null;
    }

    return response;
  }

  @Emit('submitted')
  protected emitSubmittedEvent(submitted: boolean) {
    return submitted;
  }

  @Emit('step')
  protected emitStepChange(step: number) {
    return step;
  }

  @Watch('cardIssuingProviderId')
  protected cardIssuingProviderIdChangeHandler(gateProviderId: string | null) {
    if (gateProviderId === null) {
      return;
    }

    this.fetchAvailableCardProducts(gateProviderId);
  }

  mounted() {
    this.fetchGateProviders();
  }
}
</script>

<style lang="scss" scoped>
.issue-card-form {
  @apply p-0 m-0;

  &-container {
    @apply px-0 pt-0 pb-32;
  }

  &__title {
    @apply inline-flex w-full text-left mb-32;
  }

  &__products-list {
    @apply grid grid-flow-row gap-y-8;
  }

  &__action {
    @apply mt-32;
  }
}
</style>

<style lang="scss">
.app-form-wrapper.issue-card-form {
  .app-form-wrapper__title {
    @apply mb-0;
  }
}
</style>
