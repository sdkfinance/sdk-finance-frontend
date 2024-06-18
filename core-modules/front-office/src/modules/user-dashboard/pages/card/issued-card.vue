<template>
  <div class="smart-card-page">
    <card-page
      :tabs="tabs"
      :is-loading="isLoading"
      :card-holder="cardHolder"
      :card-name="cardName"
      :card-number="cardPan"
      :card-state="cardStateLoweCase"
      :expiration-date="expirationDate"
      @activate-card="activateCardHandler">
      <template #default>
        <router-view
          :card="displayCardDetails"
          @update-settings="updateSettingsHandler" />
      </template>
    </card-page>
    <confirm-modal
      ref="confirmModalRef"
      :title="confirmModalProps.title"
      :submit-text="confirmModalProps.submitText"
      modal-width="320px" />
  </div>
</template>

<script lang="ts">
import { ISSUED_CARD_STATE, ISSUED_CARD_TRANSITION_REASON_CODE } from '@sdk5/shared/constants';
import type { ISmartCardUpdatePayload, TUserCardDetailed, TUserIssuedCard } from '@sdk5/shared/requests';
import { IssueCardRequests } from '@sdk5/shared/requests';
import { Profile } from '@sdk5/shared/store';
import type { IRouteConfig } from '@sdk5/shared/types';
import { errorNotification } from '@sdk5/shared/utils';
import { ConfirmModal } from '@sdk5/ui-kit-front-office';
import { Component, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import { ISSUED_CARD_PAGE_CHILDREN } from '../../routes';
import CardPage from './card-page.vue';
import type { TDisplayCardDetails } from './types';

const COMPONENTS = {
  CardPage,
  ConfirmModal,
} as const;

@Component({
  name: 'issued-card',
  components: COMPONENTS,
})
export default class SmartCardPage extends Vue {
  @Ref('confirmModalRef') protected readonly confirmModalRef!: ConfirmModal;

  static components: typeof COMPONENTS;

  protected readonly profileModule = getModule(Profile, this.$store);

  protected tabs: IRouteConfig[] = ISSUED_CARD_PAGE_CHILDREN;

  protected issuedCards: TUserIssuedCard[] = [];

  protected card: TUserCardDetailed | null = null;

  protected cardId: string = this.$route.params?.cardId;

  protected currentSerial: string = this.$route.params?.serial;

  protected isLoading: boolean = false;

  protected get displayCardDetails(): TDisplayCardDetails {
    return {
      cardHolder: this.cardHolder,
      cardNumber: this.cardPan,
      expirationDate: this.expirationDate,
      cvv: this.card?.cvvNumber,
      name: this.cardName,
      state: this.card?.state,
    };
  }

  protected get cardName() {
    const existIssuedCard = this.issuedCards.find((card) => card.cardId === this.cardId);
    return existIssuedCard?.name ?? '';
  }

  protected get cardPan() {
    if (!this.card?.lastFour) {
      return '';
    }

    return `${'*'.repeat(12)}${this.card.lastFour}`;
  }

  protected get expirationDate() {
    return this.card?.expiration.match(/.{1,2}/g)?.join('/') ?? '';
  }

  protected get cardState() {
    return this.card?.state ?? null;
  }

  protected get cardStateLoweCase() {
    return this.cardState?.toLowerCase() ?? null;
  }

  protected get cardHolder() {
    const { first, last } = this.profileModule.namePlain;
    return `${first} ${last}`;
  }

  protected get confirmModalProps() {
    return {
      title: this.$t('pages.user_dashboard.cards.activate_card_modal.title', { card_name: this.cardName }).toString(),
      submitText: this.$t('action.activate').toString(),
    };
  }

  protected async fetchUserIssuedCard() {
    const { response, error } = await IssueCardRequests.viewUserCards(this.currentSerial);

    if (error) {
      errorNotification(error);
      return;
    }

    this.issuedCards = response.records ?? [];
  }

  protected async getCardDetails(): Promise<void> {
    const { response, error } = await IssueCardRequests.getUserCardDetails(this.cardId, { showCVV: true });

    if (error) {
      errorNotification(error);
      return;
    }

    this.card = response.records[0] ?? null;
  }

  // eslint-disable-next-line no-unused-vars
  protected async updateSettingsHandler(form: ISmartCardUpdatePayload) {
    // TEMPORARY_REMOVED
    // if (this.cardState === null || this.cardState === ISSUED_CARD_STATE.UNACTIVATED || this.cardState === ISSUED_CARD_STATE.TERMINATED) {
    //   return;
    // }
    // const updatedCardState = form.active ? ISSUED_CARD_STATE.SUSPENDED : ISSUED_CARD_STATE.ACTIVE;
    // if (updatedCardState === this.cardState) {
    //   return;
    // }
    // this.isLoading = true;
    // const { error } = await IssueCardRequests.updateIssuedCardState(this.cardId, updatedCardState);
    // if (error !== null) {
    //   errorNotification(error);
    //   this.isLoading = false;
    //   return;
    // }
    // await this.getCardDetails();
    // this.isLoading = false;
  }

  protected async activateCardHandler() {
    const confirmed = await this.confirmModalRef.open();

    if (!confirmed) {
      return;
    }

    this.isLoading = true;
    const { error } = await IssueCardRequests.updateIssuedCardState(this.cardId, {
      state: ISSUED_CARD_STATE.ACTIVE,
      reason: 'Object activated for the first time', // Mocked
      reasonCode: ISSUED_CARD_TRANSITION_REASON_CODE.OBJECT_ACTIVATED_FOR_THE_FIRST_TIME,
    });

    if (error !== null) {
      errorNotification(error);
      this.isLoading = false;
      return;
    }

    await this.getCardDetails();
    this.isLoading = false;
  }

  async created() {
    this.isLoading = true;
    await Promise.all([this.fetchUserIssuedCard(), this.getCardDetails()]);
    this.isLoading = false;
  }
}
</script>
