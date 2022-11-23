<template>
  <div class="create-contract-first-step">
    <p class="mb-10">
      {{ $t('pages.contracts.create.welcome') }}
    </p>
    <p class="mb-10">
      {{ $t('pages.contracts.create.welcome_part_one') }}
    </p>
    <p class="mb-32">
      {{ $t('pages.contracts.create.welcome_part_two') }}
    </p>
    <div class="create-contract-first-step__block">
      <div class="create-contract-first-step__buttons">
        <app-button
          size="small"
          secondary>
          {{ $t('action.setup_providers') }}
        </app-button>
        <app-button
          size="small"
          secondary>
          {{ $t('action.setup_gates') }}
        </app-button>
        <app-button
          size="small"
          secondary>
          {{ $t('action.setup_currency_exchanges_rates') }}
        </app-button>
      </div>
      <app-button
        class="w-full"
        :to="{ name: 'create-contract-main' }">
        {{ $t('action.i_already_added_all_information') }}
      </app-button>
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';

@Component({
  components: { AppButton },
})
export default class FirstStep extends Vue {

}
</script>

<style lang="scss">
.create-contract-first-step {
  @apply flex flex-col max-w-520 mr-auto ml-auto;

  &__block {
    @apply max-w-300 w-full ml-auto mr-auto;
  }

  &__buttons {
    @apply flex flex-col items-stretch mb-32 justify-center;

    & > .btn {
      @apply m-0 mb-16;
    }
  }
}
</style>
