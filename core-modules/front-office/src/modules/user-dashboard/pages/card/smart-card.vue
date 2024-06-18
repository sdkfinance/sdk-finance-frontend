<template>
  <div class="smart-card-page">
    <card-page
      :tabs="tabs"
      :is-loading="isLoading"
      :card-name="cardName"
      :card-number="cardNumber"
      :expiration-date="expirationDate">
      <template #default>
        <router-view
          :card="displayCardDetails"
          smart-card-page
          @update-settings="updateSettingsHandler" />
      </template>
    </card-page>
  </div>
</template>

<script lang="ts">
import type { ISmartCardUpdatePayload } from '@sdk5/shared/requests';
import { SmartCardsRequests } from '@sdk5/shared/requests';
import type { IRouteConfig, ISmartCardRecord } from '@sdk5/shared/types';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { Component, Vue } from 'vue-property-decorator';

import { SMART_CARD_PAGE_CHILDREN } from '../../routes';
import CardPage from './card-page.vue';
import type { TDisplayCardDetails } from './types';

const COMPONENTS = {
  CardPage,
} as const;

@Component({
  name: 'smart-card',
  components: COMPONENTS,
})
export default class SmartCardPage extends Vue {
  static components: typeof COMPONENTS;

  protected tabs: IRouteConfig[] = SMART_CARD_PAGE_CHILDREN;

  protected card: ISmartCardRecord | null = null;

  protected cardId: string = this.$route.params?.cardId;

  protected isLoading: boolean = false;

  protected get cardName() {
    return this.card?.name ?? '';
  }

  protected get cardNumber() {
    return this.card?.cardNumber.split(' ').join('') ?? '';
  }

  protected get expirationDate() {
    return this.card?.expirationDate ?? '';
  }

  protected get displayCardDetails(): TDisplayCardDetails {
    return {
      name: this.cardName,
      cardHolder: this.cardName,
      cardNumber: this.cardNumber,
      expirationDate: this.expirationDate,
      cvv: this.card?.cvv,
      active: this.card?.active ?? false,
    };
  }

  protected async updateSettingsHandler(form: ISmartCardUpdatePayload) {
    this.isLoading = true;
    const { active, name } = form;
    const { error } = await SmartCardsRequests.updateUserCard(this.cardNumber, {
      name,
      active: !active,
    });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.getCardDetails();
  }

  created() {
    this.getCardDetails();
  }

  protected async getCardDetails(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await SmartCardsRequests.getUserCardById(this.cardId);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    [this.card] = response?.records || [{} as ISmartCardRecord];
  }
}
</script>
