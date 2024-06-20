<template>
  <div class="header-entrance-links">
    <div class="header-entrance__group">
      <slot name="headerLogo">
        <router-link
          v-if="isTopLogoVisible && ENV_VARIABLES.brandLogoMUrl"
          :to="{ name: 'entrance' }">
          <img
            :src="ENV_VARIABLES.brandLogoMUrl"
            class="header-entrance__logo"
            alt="sdk.finance" />
        </router-link>
      </slot>
    </div>

    <div class="header-entrance__group">
      <router-link
        v-if="ENV_VARIABLES.apiListPageVisible"
        class="header-entrance__link"
        :to="{
          name: 'api-list',
        }">
        {{ $t('pages.api_list.title') }}
      </router-link>
      <a
        :href="swaggerLink"
        class="header-entrance__link"
        target="_blank">
        {{ $t('pages.entrance.full_api_reference') }}
      </a>
      <a
        v-if="ENV_VARIABLES.manualGuideLinkVisible"
        href="/downloads/SDK5_manual_guide.pdf"
        class="header-entrance__link"
        target="_blank">
        {{ $t('pages.entrance.manual_guide') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ENV_VARIABLES } from '@sdk5/shared';
import { computed } from 'vue';

const DEFAULT_SWAGGER_URL = 'https://back-endapi.sdk.finance/swagger/';

withDefaults(
  defineProps<{
    isTopLogoVisible?: boolean;
  }>(),
  {
    isTopLogoVisible: false,
  },
);

const swaggerLink = computed(() => ENV_VARIABLES.swaggerUrl || DEFAULT_SWAGGER_URL);
</script>

<style lang="scss">
.header-entrance__link {
  &.router-link-exact-active {
    @apply text-blue-500;
  }
}
</style>
