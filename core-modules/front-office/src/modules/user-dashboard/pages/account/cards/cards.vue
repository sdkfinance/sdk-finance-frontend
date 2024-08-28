<template>
  <div
    v-loading="isLoading"
    class="cards-page">
    <div class="cards-page__header">
      <span class="cards-page__title">
        {{ $t('pages.user_dashboard.cards.title') }}
      </span>

      <app-button
        icon="icon-plus"
        transparent
        @click="openIssueCardModal">
        <span class="button-label">
          {{ $t('action.issue_card') }}
        </span>
      </app-button>
    </div>

    <div class="cards-page__container">
      <app-smart-card
        v-for="(card, i) in userIssuedCardsDetailed"
        :key="`card_${i}`"
        :title="card.name"
        :card-number="card.cardNumber"
        :card-state="card.state"
        :to="{ name: 'user-dashboard-account-card', params: { id: currentSerial, cardId: card.id } }"
        class="cards-page__card">
        <template v-if="card.state !== unActivatedCardStateLowerCase">
          <app-card-progress
            :amount="account.amount"
            :available-amount="account.availableAmount"
            :currency-symbol="account.currency.symbol" />
        </template>
      </app-smart-card>
    </div>

    <modal
      ref="issueCardModal"
      v-model="isIssueCardModalVisible"
      class="issue-card-modal"
      :title="issueCardModalTitle">
      <template #default="{ closeModal }">
        <issue-card-form
          :serial="currentSerial"
          @step="changeIssueCardModalByStep(2)"
          @submitted="closeModal" />
      </template>
    </modal>
    <app-modal
      ref="infoModalRef"
      is-centred
      is-full-width
      @closed="infoModalClosedHandler">
      <template #default>
        <app-info-modal
          :title="infoModalData.title"
          :type="infoModalData.modalType"
          :confirm-text="infoModalData.confirmText"
          :cancel-text="infoModalData.cancelText"
          is-cancel-visible
          @confirm="infoModalConfirmHandler"
          @cancel="infoModalCancelHandler" />
      </template>
    </app-modal>
  </div>
</template>

<script lang="ts">
import { ISSUED_CARD_STATE } from '@sdk5/shared/constants';
import { useI18n } from '@sdk5/shared/i18n';
import type { ICoin, TUserCardDetailed, TUserIssuedCard } from '@sdk5/shared/requests';
import { IssueCardRequests } from '@sdk5/shared/requests';
import type { ISmartCardShort } from '@sdk5/shared/types';
import { errorNotification } from '@sdk5/shared/utils';
import { AppButton, AppCardProgress, AppInfoModal, AppModal, AppSmartCard, InfoModalTypes, Modal } from '@sdk5/ui-kit-front-office';
import type { PropType, Ref } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { getModule } from 'vuex-module-decorators';

import { UserCoins } from '../../../../../store/modules';
import IssueCardForm from './components/issue-card-form.vue';

type TUserIssuedCardData = Pick<ISmartCardShort, 'id' | 'name' | 'cardNumber'> & Pick<TUserCardDetailed, 'state'>;

export default defineComponent({
  components: {
    IssueCardForm,
    AppCardProgress,
    AppButton,
    AppModal,
    AppSmartCard,
    AppInfoModal,
    Modal,
  },
  props: {
    account: { type: Object as PropType<ICoin>, default: () => ({}) },
  },
  setup() {
    const { t } = useI18n();
    const issueCardModal = ref(null) as unknown as Ref<InstanceType<typeof Modal>>;
    const infoModalRef = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;
    const isIssueCardModalVisible = ref(false);
    const issueCardModalTitle = ref('pages.user_dashboard.cards.issue_card_modal.title');

    const infoModalData = computed(() => ({
      title: t('pages.user_dashboard.cards.issue_card_modal.card_is_ready').toString(),
      confirmText: t('pages.user_dashboard.cards.issue_card_modal.order_physical_card').toString(),
      cancelText: t('pages.user_dashboard.cards.issue_card_modal.no_right_now').toString(),
      modalType: InfoModalTypes.success,
    }));

    return {
      issueCardModal,
      infoModalRef,
      infoModalData,
      isIssueCardModalVisible,
      issueCardModalTitle,
    };
  },
  data() {
    const userIssuedCardsDetailed: TUserIssuedCardData[] = [];
    const userIssuedCards: TUserIssuedCard[] = [];
    const currentSerial: string = this.$route.params?.serial;

    return {
      unActivatedCardStateLowerCase: ISSUED_CARD_STATE.UNACTIVATED.toLowerCase(),
      userCoinsModule: getModule(UserCoins, this.$store),
      currentSerial,
      isLoading: false,
      userIssuedCards,
      userIssuedCardsDetailed,
    };
  },
  watch: {
    userIssuedCards: 'userIssuedCardsChangeHandler',
    isIssueCardModalVisible: 'onIssueCardModalVisibilityChange',
  },
  created() {
    this.fetchUserCards();
  },
  methods: {
    openInfoModal() {
      this.infoModalRef.open();
    },
    closeInfoModal() {
      this.infoModalRef.close();
    },
    infoModalClosedHandler() {
      this.fetchUserCards();
    },
    infoModalConfirmHandler() {},
    infoModalCancelHandler() {
      this.closeInfoModal();
      this.fetchUserCards();
    },
    changeIssueCardModalByStep(step: number) {
      this.issueCardModalTitle =
        step === 1 ? 'pages.user_dashboard.cards.issue_card_modal.title' : 'pages.user_dashboard.cards.issue_card_modal.title_second';
    },
    async openIssueCardModal(): Promise<void> {
      const isSubmitted = await this.issueCardModal.openModal();

      if (isSubmitted) {
        this.openInfoModal();
      }
    },
    async fetchUserCards() {
      this.isLoading = true;
      const { response, error } = await IssueCardRequests.viewUserCards(this.currentSerial);
      this.isLoading = false;

      if (error !== null) {
        errorNotification(error);
        return;
      }

      this.userIssuedCards = response.records ?? [];
    },
    async getUserCardsDetail(userCards: TUserIssuedCard[]) {
      this.isLoading = true;
      const userCardsDetailPromises = userCards.map(async (cardData) => {
        const cardDetails = await this.fetchCardDetails(cardData.cardId);
        return {
          name: cardData.name,
          id: cardData.cardId,
          cardNumber: cardDetails?.lastFour ?? '',
          state: cardDetails?.state.toLowerCase(),
        } as TUserIssuedCardData;
      });
      this.userIssuedCardsDetailed = await Promise.all(userCardsDetailPromises);
      this.isLoading = false;
    },
    async fetchCardDetails(cardId: string) {
      const { response, error } = await IssueCardRequests.getUserCardDetails(cardId);

      if (error !== null) {
        errorNotification(error);
        return null;
      }

      return response.records[0] ?? null;
    },
    userIssuedCardsChangeHandler(userCards: TUserIssuedCard[]) {
      this.getUserCardsDetail(userCards);
    },
    onIssueCardModalVisibilityChange(visible: boolean) {
      if (!visible) {
        this.changeIssueCardModalByStep(1);
      }
    },
  },
});
</script>

<style lang="scss">
.cards-page {
  &__header {
    @apply flex justify-between items-center mb-24;

    .btn-icon--left {
      @apply mr-0 md:mr-8;
    }
  }

  &__title {
    @apply font-medium text-xl;
  }

  &__container {
    @apply grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 sm:min-h-150;
  }

  .app-modal .app-modal__close {
    @apply text-blue-600;
  }

  .issue-card-modal {
    .issue-card-form {
      @apply pt-[20px] pb-[40px];
    }

    .issue-card-form-container {
      @apply h-full overflow-visible;
    }
  }
}

.button-label {
  @apply hidden md:inline;
}
</style>
