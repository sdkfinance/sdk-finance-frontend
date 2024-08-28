<template>
  <app-modal
    ref="appModalRef"
    class="details"
    @closed="closed">
    <template #header>
      <div class="details__head-background">
        <img
          class="details__head-image"
          :src="icon"
          alt="" />

        <p class="details__card-text">
          {{ amount }}
        </p>
      </div>
      <div class="details__row">
        <p class="details__row-title">
          {{ $t(title) }}
        </p>

        <p
          v-if="formattedDate"
          class="details__row-description">
          {{ formattedDate }}
        </p>
      </div>
    </template>

    <div
      v-if="data"
      class="details__container">
      <div class="details__body">
        <details-list-form
          v-for="detail in lists"
          :key="detail.title"
          :title="$t(detail.title).toString()"
          :is-secondary="true"
          :details="detail.config">
          <template #status>
            <div class="details-list__label">
              {{ $t('form.label.status') }}
            </div>
            <app-badge
              class="details__body-badge"
              is-borderless
              is-background-transparent
              :status="data.status" />
          </template>
        </details-list-form>
        <div
          v-if="slots.description"
          class="description">
          <h3 class="description__title">
            {{ $t('form.label.description') }}
          </h3>
          <p class="description__content">
            <slot name="description" />
          </p>
        </div>
      </div>
      <div
        v-if="slots.footer"
        class="details__footer">
        <slot
          name="footer"
          v-bind="{ open, close }" />
      </div>
    </div>
  </app-modal>
</template>

<script setup lang="ts">
import type { IDetailsValue, IPlainObject } from '@sdk5/shared/src/types';
import { AppBadge, AppModal, DetailsList as DetailsListForm } from '@sdk5/ui-kit-front-office';
import dayjs from 'dayjs';
import type { Ref } from 'vue';
import { useSlots } from 'vue';
import { computed, ref } from 'vue';

import iconPlaceholder from '../../../assets/icons/empty-category.svg';

export type TPaymentDetailsModalProps = {
  data?: IPlainObject | null;
  title: string;
  lists: { title: string; config: IDetailsValue[] }[];
  amount?: string | number;
  icon?: string;
  date: string;
};

const props = withDefaults(defineProps<TPaymentDetailsModalProps>(), {
  data: undefined,
  icon: iconPlaceholder,
  amount: '',
});

const emit = defineEmits(['closed']);

const slots = useSlots();

const appModalRef = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;

const formattedDate = computed(() => (props.date ? dayjs(props.date).format('D MMM, HH:mm') : ''));

const open = () => {
  appModalRef.value.open();
};
const close = () => {
  appModalRef.value.close();
};

const closed = () => {
  emit('closed', false);
};

defineExpose({
  open,
  close,
});
</script>

<style lang="scss">
.details {
  &__container {
    @apply flex justify-between flex-col h-full;
  }

  &__head-background {
    @apply w-full h-150 bg-primary flex items-center justify-between px-24 text-white font-semibold text-xl;
  }

  &__head-image {
    filter: brightness(0) invert(1);

    @apply h-32 w-32;
  }

  &__head {
    @apply px-25 pb-25;

    &-row {
      @apply relative -top-35 flex items-center justify-between;

      .details__card {
        @apply p-18 bg-white rounded-lg border border-blue-300 w-fit font-bold;

        &-text {
          @apply text-gray-900;
        }
      }
    }
  }

  .details__row {
    @apply px-24 pb-32 pt-24;

    &--sub {
      @apply flex-col items-start static -mt-10;
    }

    &-title {
      @apply text-gray-900 text-xl mb-5 font-semibold;
    }

    &-subtitle {
      @apply text-blue-500 text-base font-semibold;
    }

    &-description {
      @apply text-blue-500 text-base font-medium;
    }
  }

  &__body {
    @apply p-25 flex flex-col gap-y-[1.5rem];

    &-badge {
      @apply ml-auto px-0;
    }
  }

  &__footer {
    @apply px-25 pb-32;
  }
}

.description {
  @apply mt-32;

  &__title {
    @apply text-base font-semibold mb-16;
  }

  &__content {
    @apply text-base font-medium;
  }
}
</style>
