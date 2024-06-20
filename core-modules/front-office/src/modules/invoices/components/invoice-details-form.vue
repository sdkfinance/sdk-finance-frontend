<template>
  <div
    v-loading="isCurrentUserProfileFetching"
    class="invoice-details-form">
    <div class="invoice-details-form__actions">
      <app-button
        v-if="isPayInvoiceButtonVisible"
        class="button"
        @click="onPayClicked">
        {{ $t('action.pay_for_invoice') }}
      </app-button>

      <app-button
        v-if="isStatusPending"
        class="button"
        secondary
        transparent
        underline
        no-padding
        size="small"
        @click="onDeleteClicked">
        {{ $t('action.delete_invoice') }}
      </app-button>
    </div>

    <div class="invoice-details-form__lists">
      <details-list
        title="pages.invoices.main_info"
        :details="mainInfo">
        <template #status-value="{ value }">
          <app-badge :status="value" />
        </template>
        <template #paymentLink-value>
          <div class="invoice-details-form__payment-link-actions">
            <app-button
              native-type="button"
              type="secondary"
              size="small"
              transparent
              underline
              no-padding
              @click="copyPaymentLinkButtonClickHandler">
              {{ $t('action.copy_payment_link') }}
            </app-button>
            <app-button
              native-type="button"
              type="secondary"
              size="small"
              transparent
              underline
              no-padding
              @click="viewQrCodeButtonClickHandler">
              {{ $t('action.view_qr_code') }}
            </app-button>
          </div>
        </template>
      </details-list>
      <details-list
        title="pages.invoices.operation_details"
        :details="operationDetails" />
      <details-list
        title="pages.invoices.created_by_user"
        :details="createdByUser" />
      <details-list
        title="pages.invoices.payer_details"
        :details="payerDetails" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGetCurrentUserProfileApi } from '@sdk5/shared/composables';
import { INVOICE_STATUS_ENUM, ROLES } from '@sdk5/shared/constants';
import type { IInvoicesRecord } from '@sdk5/shared/requests';
import type { IDetailsValue } from '@sdk5/shared/types';
import { copyToClipboard as copyToClipboardLegacy, successNotification } from '@sdk5/shared/utils';
import { AppBadge, AppButton, DetailsList } from '@sdk5/ui-kit-front-office';
import { useClipboard } from '@vueuse/core';
import { computed, watch } from 'vue';

const props = defineProps<{
  invoiceDetails: Partial<IInvoicesRecord>;
}>();
const emit = defineEmits(['open-pay-invoice-modal', 'open-delete-invoice-modal', 'view-qr-code']);

const { isFetching: isCurrentUserProfileFetching, userRole, userOrganizationId } = useGetCurrentUserProfileApi();

const invoiceIdentifier = computed(() => props.invoiceDetails.identifier);
const invoicePaymentLink = computed(() => `${window.location.origin}/front-office/invoice/${invoiceIdentifier.value}`);
const invoiceCreatorOrganizationId = computed(() => props.invoiceDetails.createdByUser?.profileOrganizationId);
const isInvoiceCreator = computed(() => userOrganizationId.value === invoiceCreatorOrganizationId.value);
const isRoleIndividual = computed(() => userRole.value === ROLES.individual);
const isStatusPending = computed(() => props.invoiceDetails.status === 'pending');
const isPayInvoiceButtonVisible = computed(() => isStatusPending.value && isRoleIndividual.value && !isInvoiceCreator.value);
const mainInfo = computed<IDetailsValue[]>(() => {
  return [
    {
      label: 'form.label.id',
      param: 'identifier',
      value: props.invoiceDetails.identifier,
    },
    {
      label: 'form.label.name',
      param: 'name',
      value: props.invoiceDetails.name,
    },
    {
      label: 'form.label.status',
      param: 'status',
      value: props.invoiceDetails.status,
    },
    {
      label: 'form.label.created_at',
      param: 'createdAt',
      value: props.invoiceDetails.createdAt,
    },
    {
      label: 'form.label.expired_at',
      param: 'expiresAt',
      value: props.invoiceDetails.expiresAt,
    },
    {
      label: 'form.label.payment_link',
      param: 'paymentLink',
      value: undefined,
      hide: props.invoiceDetails.status !== INVOICE_STATUS_ENUM.pending,
    },
  ];
});
const operationDetails = computed<IDetailsValue[]>(() => {
  return [
    {
      label: 'form.label.total_price',
      param: 'totalPrice',
      value: props.invoiceDetails.totalPrice,
    },
    {
      label: 'form.label.vat_applied',
      param: 'name',
      value: props.invoiceDetails.name,
    },
    {
      label: 'form.label.expires_at',
      param: 'expiresAt',
      value: props.invoiceDetails.expiresAt,
    },
    {
      label: 'form.label.created_at',
      param: 'createdAt',
      value: props.invoiceDetails.createdAt,
    },
    {
      label: 'form.label.merchant_name',
      param: 'merchantName',
      value: props.invoiceDetails.merchantName,
    },
    {
      label: 'form.label.payment_code',
      param: 'paymentCode',
      value: props.invoiceDetails.paymentCode,
    },
    {
      label: 'form.label.currency_id',
      param: 'id',
      value: props.invoiceDetails.currency?.id,
    },
    {
      label: 'form.label.serial_number',
      param: 'sn',
      value: props.invoiceDetails.currency?.sn,
    },
    {
      label: 'form.label.currency',
      param: 'currency',
      value: props.invoiceDetails.currency?.code,
    },
  ];
});
const createdByUser = computed<IDetailsValue[]>(() => {
  return [
    {
      label: 'form.label.id',
      param: 'id',
      value: props.invoiceDetails.createdByUser?.id,
    },
    {
      label: 'form.label.name',
      param: 'name',
      value: props.invoiceDetails.createdByUser?.name,
    },
    {
      label: 'form.label.organization_id',
      param: 'profileOrganizationId',
      value: props.invoiceDetails.createdByUser?.profileOrganizationId,
    },
  ];
});
const payerDetails = computed<IDetailsValue[]>(() => {
  return [
    {
      label: 'form.label.status',
      param: 'status',
      value: (props.invoiceDetails.payer as any)?.status, // Field doesn't exist
    },
    {
      label: 'form.label.message',
      param: 'message',
      value: (props.invoiceDetails.payer as any)?.message, // Field doesn't exist
    },
    {
      label: 'form.label.id',
      param: 'id',
      value: props.invoiceDetails.payer?.id,
    },
    {
      label: 'form.label.type',
      param: 'type',
      value: props.invoiceDetails.payer?.type,
    },
    {
      label: 'form.label.name',
      param: 'name',
      value: props.invoiceDetails.payer?.name,
    },
    {
      label: 'form.label.status_identification',
      param: 'identificationStatus',
      value: (props.invoiceDetails.payer as any)?.identificationStatus, // Field doesn't exist
    },
  ];
});

const { copy: copyPaymentLink, copied, isSupported } = useClipboard({ source: invoicePaymentLink.value });

const onPayClicked = () => {
  emit('open-pay-invoice-modal');
};
const onDeleteClicked = () => {
  emit('open-delete-invoice-modal');
};

const copyPaymentLinkButtonClickHandler = () => {
  if (!isSupported.value) {
    copyToClipboardLegacy(invoicePaymentLink.value);
    successNotification('notification.copied');
    return;
  }

  copyPaymentLink();
};
const viewQrCodeButtonClickHandler = () => emit('view-qr-code');

watch(copied, (isCopied) => {
  if (isCopied) {
    successNotification('notification.copied');
  }
});
</script>

<style lang="scss">
.invoice-details-form {
  &__actions {
    @apply mb-[1rem];
  }

  &__lists {
    @apply flex flex-col gap-y-[1.5rem];
  }

  &__payment-link-actions {
    @apply flex items-center gap-x-[1rem];

    .app-button {
      @apply ml-0;
    }
  }
}
</style>
