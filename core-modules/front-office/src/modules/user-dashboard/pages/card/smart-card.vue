<template>
  <div class="smart-card-page">
    <card-page
      :tabs="SMART_CARD_PAGE_CHILDREN"
      :is-loading="isLoaderVisible"
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

<script setup lang="ts">
import { useGetSmartCardByIdApi, useRouteParams, useUpdateUserSmartCardApi } from '@sdk5/shared';
import type { ISmartCardUpdatePayload } from '@sdk5/shared/requests';
import dayjs from 'dayjs';
import { computed } from 'vue';

import { SMART_CARD_PAGE_CHILDREN } from '../../routes';
import CardPage from './card-page.vue';
import type { TDisplayCardDetails } from './types';

const { value: cardId } = useRouteParams('cardId');

const { mutateAsync: processUpdateUserSmartCard, isPending: isUpdateUserSmartCardPending } = useUpdateUserSmartCardApi();
const { smartCardRecord: card, isFetching: isSmartCardByIdFetching, invalidateQuery: invalidateSmartCardByIdQuery } = useGetSmartCardByIdApi(cardId);

const isLoaderVisible = computed(() => isSmartCardByIdFetching.value || isUpdateUserSmartCardPending.value);
const cardName = computed(() => card.value?.name ?? '');
const expirationDate = computed(() => (card.value?.expirationDate ? dayjs(new Date(card.value.expirationDate)).format('MM/YY') : ''));
const cardNumber = computed(() => card.value?.cardNumber.split(' ').join('') ?? '');
const displayCardDetails = computed(
  () =>
    ({
      name: cardName.value,
      cardHolder: cardName.value,
      cardNumber: cardNumber.value,
      expirationDate: expirationDate.value,
      cvv: card.value?.cvv,
      active: card.value?.active ?? false,
    }) satisfies TDisplayCardDetails,
);

const updateSettingsHandler = async (form: ISmartCardUpdatePayload) => {
  const { active, name } = form;
  const { error } = await processUpdateUserSmartCard({
    cardNumber: cardNumber.value,
    updatePayload: {
      name,
      active: !active,
    },
  });

  if (!error) {
    invalidateSmartCardByIdQuery();
  }
};
</script>
