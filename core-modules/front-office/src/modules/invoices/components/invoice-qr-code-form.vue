<template>
  <div
    v-loading="isFetching"
    class="invoice-qr-code-form">
    <div class="invoice-qr-code-form__qr-code qr-code">
      <div class="qr-code__img-wrapper">
        <span class="qr-code__corner qr-code__corner--tl" />
        <span class="qr-code__corner qr-code__corner--tr" />
        <span class="qr-code__corner qr-code__corner--bl" />
        <span class="qr-code__corner qr-code__corner--br" />
        <img
          v-if="imageString"
          class="qr-code__img"
          :src="imageString"
          :alt="invoiceIdentify" />
      </div>
    </div>
    <div class="invoice-qr-code-form__actions">
      <!--   Temporary hidden   -->
      <app-button
        v-if="false"
        native-type="button"
        type="primary"
        size="big"
        full-width
        :disabled="isFetching"
        @click="sendPaymentLinkButtonClickHandler">
        {{ $t('action.send_payment_link_to_the_client') }}
      </app-button>
      <app-button
        native-type="button"
        type="secondary"
        size="big"
        :disabled="isFetching"
        outlined
        full-width
        @click="downLoadQrCodeButtonClickHandler">
        {{ $t('action.download_qr_code_as_image') }}
      </app-button>
      <app-button
        native-type="button"
        type="secondary"
        size="big"
        outlined
        full-width
        @click="cancelButtonClickHandler">
        {{ $t('action.cancel') }}
      </app-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoadProtectedMediaApi } from '@sdk5/shared/composables';
import type { IInvoicesRecord } from '@sdk5/shared/requests';
import { downloadFile } from '@sdk5/shared/utils';
import { AppButton } from '@sdk5/ui-kit-front-office';
import { computed } from 'vue';

const props = defineProps<{
  invoiceData: Partial<IInvoicesRecord>;
}>();
const emit = defineEmits<{
  (event: 'cancel'): void;
}>();

const DEFAULT_QR_FILE_NAME = 'invoice';

const qrCodeMediaId = computed(() => props.invoiceData.qrCodeMediaFileId);
const { isFetching, imageString } = useLoadProtectedMediaApi(qrCodeMediaId);

const invoiceIdentify = computed(() => props.invoiceData.identifier);

const sendPaymentLinkButtonClickHandler = () => {};
const downLoadQrCodeButtonClickHandler = () => {
  if (!imageString.value) {
    return;
  }

  downloadFile(imageString.value, `${invoiceIdentify.value ? `${DEFAULT_QR_FILE_NAME}-${invoiceIdentify.value}` : DEFAULT_QR_FILE_NAME}.png`);
};
const cancelButtonClickHandler = () => emit('cancel');
</script>

<style scoped lang="scss">
.invoice-qr-code-form {
  @apply flex flex-col gap-y-[3rem] mt-[1.25rem];

  &__actions {
    @apply flex flex-col gap-y-[1rem];

    .app-button {
      @apply ml-0;
    }
  }

  .qr-code {
    @apply flex justify-center relative;

    &__img {
      @apply w-[9.25rem] h-[9.25rem];

      &-wrapper {
        @apply relative p-[0.25rem] rounded-[0.25rem] border border-solid border-[#5A58CC80];
      }
    }

    &__corner {
      @apply border-blue-300 w-[2.25rem] h-[2.25rem] absolute;

      &--tl,
      &--tr {
        @apply -top-[1.125rem] border-t-[0.25rem];
      }

      &--bl,
      &--br {
        @apply -bottom-[1.125rem] border-b-[0.25rem];
      }

      &--tl,
      &--bl {
        @apply -left-[1.125rem] border-l-[0.25rem];
      }

      &--tr,
      &--br {
        @apply -right-[1.125rem] border-r-[0.25rem];
      }

      &--tl {
        @apply rounded-tl-[20px];
      }

      &--tr {
        @apply rounded-tr-[20px];
      }

      &--bl {
        @apply rounded-bl-[20px];
      }

      &--br {
        @apply rounded-br-[20px];
      }
    }
  }
}
</style>
